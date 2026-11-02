import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const root = resolve(directory, '..');
const plugin = JSON.parse(readFileSync(resolve(root, 'plugin.json'), 'utf8'));
const endpoint = JSON.parse(readFileSync(resolve(root, 'mcp.json'), 'utf8')).mcpServers['guide-public'].url;
const fixture = resolve(directory, 'fixture');
mkdirSync(fixture, { recursive: true });
cpSync(resolve(root, 'skills'), resolve(fixture, '.agents/skills'), { recursive: true });
cpSync(resolve(root, 'skills'), resolve(directory, 'target/skills'), { recursive: true, filter: source => !source.includes('.plugin-eval') });
const cases = plugin.extensions['com.openai'].review.test_cases;
const scenarios = [...cases.positive, ...cases.negative].map((item, index) => ({
  id: `case-${index + 1}`,
  title: item.description.split('. Setup:')[0],
  purpose: item.description,
  userInput: `Use the unchanged local Cicada Guide skills in .agents/skills. Read get-legislation/SKILL.md and the relevant task skill before answering. Use only the configured guide-public MCP tools for legislative facts. Do not use web search, shell HTTP requests, or outside knowledge as substitutes. Do not edit the skills, install anything, publish, or contact officials. Answer this user request: ${item.prompt}\n\nSave your answer to answer.md and include it in your final response.`,
  successChecklist: [item.expected_behavior || item.description, ...(item.tools_triggered ? [`Expected tool coverage: ${item.tools_triggered}`] : ['No legislative tool calls.']), 'Answer is supported by returned evidence; missing data and errors are disclosed.'],
}));
const config = {
  kind: 'plugin-eval-benchmark', schemaVersion: 2, version: 2,
  targetKind: 'skill', targetName: 'get-legislation',
  runner: { type: 'codex-cli', model: 'gpt-6.1-sol', sandbox: 'workspace-write', approvalPolicy: 'never', extraArgs: ['-c', `mcp_servers.guide-public.url=${JSON.stringify(endpoint)}`] },
  workspace: { sourcePath: fixture, setupMode: 'copy', preserve: 'never' },
  targetProvisioning: { mode: 'isolated-skill-home' },
  verifiers: { commands: [] },
  notes: ['Codex compatibility benchmark, not native ChatGPT plugin installation or rendering.', 'All four source skills copied unchanged. Natural review prompts are wrapped with explicit skill-loading instructions.', 'Harness completed status only means process completion. Review tool traces and answers against successChecklist separately.', 'No shell verifiers: upstream harness hardcodes /bin/zsh, unavailable on Windows.', 'Token usage is full CLI context, not isolated incremental skill cost. One run per case; no statistical reliability claim.'],
  scenarios,
};
writeFileSync(resolve(directory, 'benchmark.json'), JSON.stringify(config, null, 2) + '\n');
writeFileSync(resolve(directory, 'pilot.json'), JSON.stringify({ ...config, scenarios: scenarios.slice(0, 1) }, null, 2) + '\n');
console.log(`Prepared ${scenarios.length} cases against ${endpoint}`);
