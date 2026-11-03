import { mkdirSync, writeFileSync } from 'node:fs';
const endpoint = 'https://openai.cicada.guide/mcp';
let id = 0, session;
const evidence = { checkedAt: new Date().toISOString(), endpoint, calls: [] };
async function rpc(method, params) {
  const request = { jsonrpc: '2.0', method, ...(params ? { params } : {}), ...(method.startsWith('notifications/') ? {} : { id: ++id }) };
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream', 'MCP-Protocol-Version': '2025-06-18', ...(session ? { 'mcp-session-id': session } : {}) }, body: JSON.stringify(request), signal: AbortSignal.timeout(30000) });
  session = res.headers.get('mcp-session-id') ?? session;
  const body = await res.text();
  if (!res.ok) throw new Error(`${method}: HTTP ${res.status}: ${body.slice(0, 300)}`);
  if (!body.trim()) return;
  const messages = body.trim().startsWith('{') ? [JSON.parse(body)] : body.split(/\r?\n\r?\n/).map(e => e.split(/\r?\n/).filter(l => l.startsWith('data:')).map(l => l.slice(5).trimStart()).join('\n')).filter(Boolean).map(JSON.parse);
  const answer = messages.find(m => m.id === request.id);
  if (answer?.error) throw new Error(JSON.stringify(answer.error));
  if (!answer) throw new Error(`No answer for ${method}`);
  evidence.calls.push({ method, params, result: answer.result });
  return answer.result;
}
try {
  await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'cicada-guide-public-package-check', version: '0.1.0' } });
  await rpc('notifications/initialized');
  const { tools } = await rpc('tools/list');
  const { resources } = await rpc('resources/list');
  const statusTool = tools.find(tool => tool.name === 'show_status');
  const expected = statusTool ? [18, 5] : [17, 4];
  if (tools.length !== expected[0] || resources.length !== expected[1]) throw new Error(`Expected ${expected[0]} tools and ${expected[1]} resources, got ${tools.length}/${resources.length}`);
  if (statusTool && !resources.some(resource => resource.uri === statusTool._meta?.ui?.resourceUri)) throw new Error('Status card resource missing');
  for (const t of tools) for (const hint of ['readOnlyHint', 'openWorldHint', 'destructiveHint']) if (typeof t.annotations?.[hint] !== 'boolean') throw new Error(`${t.name}: missing ${hint}`);
  for (const r of resources) await rpc('resources/read', { uri: r.uri });
  const call = async (name, args = {}) => {
    const schema = tools.find(t => t.name === name).inputSchema;
    if (schema.properties.context) args.context = 'The researcher verifies public state legislative records and checks scoped lookup behavior before preparing a public research plugin package.';
    if (schema.properties.llm_model) args.llm_model = 'unknown';
    const result = await rpc('tools/call', { name, arguments: args });
    if (result.isError || result.content?.some(c => /^Error:|^MCP error/.test(c.text ?? ''))) throw new Error(`${name}: ${JSON.stringify(result).slice(0, 400)}`);
    return result.structuredContent ?? result;
  };
  if (statusTool) {
    const message = 'Which state would you like to research?';
    const status = await call('show_status', { kind: 'clarification', message });
    if (status.kind !== 'clarification' || status.message !== message) throw new Error('Unexpected status card payload');
  }
  const states = await call('list_states', { response_format: 'json' });
  const state = states.items.find(s => s.name === 'Alabama');
  if (!state) throw new Error('Alabama unavailable');
  const sessions = await call('list_sessions', { division_id: state.id, name: '2026', response_format: 'json' });
  const sessionRecord = sessions.items.find(s => /2026.*Regular|Regular.*2026/i.test(s.name));
  if (!sessionRecord) throw new Error('2026 Regular Session unavailable');
  const bills = await call('search_bills', { bill: 'HB591', division_id: state.id, session_id: sessionRecord.id, response_format: 'json' });
  if (bills.items.length !== 1) throw new Error('Expected one scoped HB591');
  const bill = bills.items[0];
  console.log('Bill:', bill.id, bill.bill_number ?? bill.bill ?? bill.title);
  await call('get_bill', { id: bill.id, response_format: 'json' });
  await call('get_bill_dossier', { bill_id: bill.id, response_format: 'json' });
  await call('get_documents', { bill_id: bill.id, response_format: 'json' });
  const document = await call('get_latest_bill_document', { bill_id: bill.id, response_format: 'json' });
  console.log('Document envelope:', JSON.stringify(document).slice(0, 250));
  const rollcalls = await call('get_rollcalls', { bill_id: bill.id, response_format: 'json' });
  if (rollcalls.items.length) await call('get_rollcall_breakdown', { rollcall_id: rollcalls.items[0].id });
  await call('show_bill', { id: bill.id, headline: bill.title.slice(0, 120), summary: 'The record identifies this measure as ' + bill.title + '. This protocol check has not interpreted its provisions or established its present legal status.' });
  const people = await call('search_people', { name: 'Rex Reynolds', response_format: 'json' });
  if (people.items.length !== 1) throw new Error('Person lookup ambiguous');
  const person = people.items[0];
  await call('get_person', { id: person.id, response_format: 'json' });
  await call('show_official', { id: person.id });
  await call('show_person_record', { id: person.id });
  await call('get_person_votes', { people_id: person.id, latest: true, response_format: 'json' });
  const missing = await call('search_bills', { bill: 'HB999999', division_id: state.id, session_id: sessionRecord.id, response_format: 'json' });
  if (missing.items.length) throw new Error('Unexpected nonexistent bill');
  evidence.smoke = { billId: bill.id, personId: person.id, sessionId: sessionRecord.id, note: 'Protocol/data smoke only; no ChatGPT skill execution or rendering established.' };
  evidence.discovery = { toolNames: tools.map(t => t.name), resources: resources.map(r => r.uri) };
  evidence.status = 'passed';
} catch (error) { evidence.status = 'failed'; evidence.error = error.message; process.exitCode = 1; }
finally { mkdirSync('docs/evidence', { recursive: true }); writeFileSync('docs/evidence/live.json', JSON.stringify(evidence, null, 2) + '\n'); console.log(evidence.status, evidence.error ?? ''); }
