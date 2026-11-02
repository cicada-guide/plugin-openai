import test from 'node:test';
import assert from 'node:assert/strict';
import { checkSource, checkFiles } from '../scripts/check.mjs';
const { files } = checkSource();
const mutated = (path, fn) => ({ ...files, [path]: Buffer.from(fn(Buffer.from(files[path]).toString('utf8'))) });
test('source package passes but reports missing public materials', () => {
  const result = checkFiles(files);
  assert.deepEqual(result.failures, []);
  assert(result.submissionGaps.includes('demo_recording_url'));
  assert.deepEqual(result.submissionGaps, ['demo_recording_url']);
});
test('rejects archive traversal and hidden compatibility manifests', () => {
  for (const name of ['../secret', '.app.json', '.codex-plugin/plugin.json', 'assets/../../secret']) assert(checkFiles({ ...files, [name]: Buffer.from('{}') }).failures.length);
});
test('rejects app bindings and wrong transport', () => {
  assert(checkFiles(mutated('plugin.json', s => { const x=JSON.parse(s); x.extensions['com.openai'].apps='./.app.json'; return JSON.stringify(x); })).failures.length);
  assert(checkFiles(mutated('mcp.json', s => s.replace('streamable-http', 'http'))).failures.length);
});
test('requires explicit anonymous auth and rejects credential-bearing extensions', () => {
  for (const auth of [undefined, { type: 'oauth' }, { type: 'none', clientSecret: 'not-a-real-secret' }]) {
    const changed = mutated('mcp.json', s => {
      const x = JSON.parse(s);
      x.mcpServers['guide-public'].extensions['com.openai'].auth = auth;
      return JSON.stringify(x);
    });
    assert(checkFiles(changed).failures.length);
  }
});
test('rejects stale host instructions, broken links and invalid frontmatter', () => {
  const p='skills/get-legislation/SKILL.md';
  for(const suffix of ['\n${CLAUDE_PLUGIN_ROOT}', '\n[missing](references/missing.md)']) assert(checkFiles(mutated(p,s=>s+suffix)).failures.length);
  assert(checkFiles(mutated(p,s=>s.replace('name: get-legislation','name: wrong'))).failures.length);
});
test('rejects oversized listing subtitle and missing review cases', () => {
  assert(checkFiles(mutated('plugin.json',s=>{const x=JSON.parse(s);x.extensions['com.openai'].interface.shortDescription='x'.repeat(31);return JSON.stringify(x);})).failures.length);
  assert(checkFiles(mutated('plugin.json',s=>{const x=JSON.parse(s);x.extensions['com.openai'].review.test_cases.positive.pop();return JSON.stringify(x);})).failures.length);
});
