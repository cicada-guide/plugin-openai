import { readFileSync, writeFileSync } from 'node:fs';
const evidence = JSON.parse(readFileSync('docs/evidence/live.json', 'utf8'));
if (evidence.status !== 'passed') throw new Error('Use a successful live check before syncing references');
const tools = evidence.calls.find(c => c.method === 'tools/list').result.tools;
const header = `# Live OpenAI tool reference\n\nSnapshot checked on ${evidence.checkedAt}. The endpoint is unversioned; live host definitions take precedence. Analytics fields may appear only when instrumentation is enabled. Send only advertised parameters.\n\n`;
const body = tools.map(t => `## ${t.name}\n\n${t.description}\n\nInput schema:\n\n\`\`\`json\n${JSON.stringify(t.inputSchema, null, 2)}\n\`\`\`\n\n`).join('');
writeFileSync('docs/tool-reference.md', (header + body).trimEnd() + '\n');
