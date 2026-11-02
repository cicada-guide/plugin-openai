import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import Ajv2020 from 'ajv/dist/2020.js';
const evidence = JSON.parse(readFileSync(new URL('../docs/evidence/live.json', import.meta.url), 'utf8'));
const tools = evidence.calls.find(c => c.method === 'tools/list').result.tools;
const ajv = new Ajv2020({ strict: false, validateFormats: false });
test('recorded live tool calls conform to advertised schemas', () => {
  for (const call of evidence.calls.filter(c => c.method === 'tools/call')) {
    const schema = tools.find(t => t.name === call.params.name).inputSchema;
    const valid = ajv.compile(schema);
    assert(valid(call.params.arguments), `${call.params.name}: ${JSON.stringify(valid.errors)}`);
  }
});
test('voting schemas reject the wrong person key and offset pagination', () => {
  const valid = ajv.compile(tools.find(t => t.name === 'get_person_votes').inputSchema);
  assert.equal(valid({ person_id: '6b9e24d2-9f2b-457f-8a81-e5ff1b31cd3c' }), false);
  assert.equal(valid({ people_id: '6b9e24d2-9f2b-457f-8a81-e5ff1b31cd3c', offset: 1 }), false);
});
test('tool reference snapshot matches every advertised input schema', () => {
  const text = readFileSync(new URL('../skills/get-legislation/references/tool-reference.md', import.meta.url), 'utf8');
  const sections = text.split(/^## /m).slice(1);
  assert.equal(sections.length, tools.length);
  for (const tool of tools) {
    const section = sections.find(s => s.startsWith(tool.name + '\n'));
    assert(section, tool.name);
    const block = section.match(/```json\r?\n([\s\S]*?)\r?\n```/);
    assert.deepEqual(JSON.parse(block[1]), tool.inputSchema, tool.name);
  }
});
