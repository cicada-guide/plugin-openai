import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Ajv from 'ajv';

const input = resolve(process.argv[2] || '.plugin-eval/suite-result.json');
const run = JSON.parse(readFileSync(input, 'utf8'));
const evidence = JSON.parse(readFileSync('docs/evidence/live.json', 'utf8'));
const schemas = evidence.calls.find(call => call.method === 'tools/list').result.tools;
const ajv = new Ajv({ strict: false, allErrors: true, validateFormats: false });
const validators = new Map(schemas.map(tool => [tool.name, ajv.compile(tool.inputSchema)]));
const rows = run.scenarios.map(scenario => {
  const events = readFileSync(scenario.rawEventLogPath, 'utf8').trim().split('\n').map(line => JSON.parse(line));
  const items = events.filter(event => event.type === 'item.completed').map(event => event.item);
  const calls = items.filter(item => item.type === 'mcp_tool_call');
  const turns = events.filter(event => event.type === 'turn.completed' && typeof event.usage?.input_tokens === 'number');
  const usage = turns.at(-1)?.usage ?? null;
  const expected = scenario.successChecklist.find(text => text.startsWith('Expected tool coverage: '))?.slice(24).split(', ').map(text => text.trim()) ?? [];
  const names = calls.map(call => call.tool);
  const missingTools = expected.filter(name => !names.includes(name));
  const argumentErrors = calls.flatMap(call => {
    const validate = validators.get(call.tool);
    return validate && !validate(call.arguments) ? [{ tool: call.tool, errors: structuredClone(validate.errors) }] : [];
  });
  return {
    id: scenario.id, title: scenario.title, processStatus: scenario.status,
    durationSeconds: Number((scenario.durationMs / 1000).toFixed(2)),
    usage, toolCount: calls.length, tools: names, missingTools, argumentErrors,
    mcpErrors: calls.filter(call => call.error || call.result?.isError || call.result?.is_error).map(call => ({ tool: call.tool, error: call.error })),
    noToolBoundarySatisfied: scenario.id.match(/case-[678]$/) ? calls.length === 0 : null,
    commandCount: items.filter(item => item.type === 'command_execution').length,
    changedFiles: scenario.workspaceSummary.changedFiles.map(file => file.path),
    answer: scenario.finalMessagePreview,
    rawEventLogPath: scenario.rawEventLogPath,
    calls: calls.map(call => ({ tool: call.tool, arguments: call.arguments, data: call.result?.structured_content ?? call.result?.structuredContent ?? null })),
  };
});
writeFileSync(input.replace(/\.json$/, '-verified.json'), JSON.stringify({
  note: 'Raw-event extraction; tool arguments checked against the recorded live schema. Semantic review and ChatGPT rendering remain separate. Usage comes only from turn.completed.',
  model: run.config.model, codexVersion: run.codexVersion, rows,
}, null, 2) + '\n');
for (const row of rows) console.log(JSON.stringify({ ...row, calls: undefined, rawEventLogPath: undefined }));
