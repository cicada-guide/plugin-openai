import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, lstatSync, mkdtempSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { delimiter, dirname, isAbsolute, join, relative, sep } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  source: { type: 'string' },
  'eval-home': { type: 'string' },
  model: { type: 'string' },
} });
if (!values.source || !values['eval-home'] || !values.model) {
  throw new Error('Required: --source CHECKOUT --eval-home DISPOSABLE_CODEX_HOME --model MODEL');
}

const source = realpathSync(values.source);
const evalHome = realpathSync(values['eval-home']);
const tempRoot = realpathSync(tmpdir());
const activeHomes = [process.env.CODEX_HOME, join(homedir(), '.codex')].filter(Boolean);
function contains(parent, child) {
  const path = relative(parent, child);
  return !isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`);
}
if (tempRoot === evalHome || !contains(tempRoot, evalHome) ||
    activeHomes.some(path => {
      if (!existsSync(path)) return false;
      const activeHome = realpathSync(path);
      return contains(activeHome, evalHome) || contains(evalHome, activeHome);
    })) {
  throw new Error('Use a disposable Codex home under the OS temp directory, separate from your active home.');
}
const configPath = join(evalHome, 'config.toml');
if (lstatSync(configPath, { throwIfNoEntry: false })) {
  throw new Error('Use a fresh disposable Codex home with no config.toml.');
}

const server = 'guide-public';
const endpoint = JSON.parse(readFileSync(join(source, 'mcp.json'), 'utf8')).mcpServers[server].url;
if (endpoint !== 'https://openai.cicada.guide/mcp') throw new Error('Unexpected Cicada Guide endpoint.');
const runDir = mkdtempSync(join(tempRoot, 'cicada-setup-benchmark-'));
const override = process.env.CODEX_APP_RUNTIME_CLI_PATH;
const runtime = override ? realpathSync(override) : 'codex';
const env = { ...process.env, CODEX_HOME: evalHome };
if (override) {
  const pathKey = Object.keys(env).find(key => key.toUpperCase() === 'PATH') ?? 'PATH';
  env[pathKey] = [dirname(runtime), env[pathKey]].filter(Boolean).join(delimiter);
}
cpSync(join(source, 'skills'), join(runDir, 'skills'), { recursive: true });
const setupSkill = join(runDir, 'skills', 'setup', 'SKILL.md');
console.log(`Local run artifacts: ${runDir}`);

function codex(args) {
  return spawnSync(runtime, args, {
    cwd: runDir, env, encoding: 'utf8', timeout: 180_000, maxBuffer: 32 * 1024 * 1024,
    windowsHide: true,
  });
}

function registrations() {
  const run = codex(['mcp', 'list', '--json']);
  if (run.status !== 0) throw new Error('Runner error: Codex could not list MCP registrations.');
  return JSON.parse(run.stdout);
}

function runSetup(stage, sandbox) {
  const args = ['-a', 'never', 'exec', '--json', '--ephemeral', '--skip-git-repo-check',
    '--disable', 'apps', '--disable', 'plugins', '-m', values.model, '-s', sandbox];
  if (process.platform === 'win32') args.push('-c', 'windows.sandbox="elevated"');
  if (sandbox === 'workspace-write') args.push('--add-dir', evalHome);
  const run = codex([...args,
    `Read the setup skill at "${setupSkill}" and follow it for this request: Set up the Cicada Guide MCP connection in Codex. `
    + 'This is a disposable test profile. Use the shell to read that skill and run Codex commands as directed. '
    + 'Leave other configuration and files alone. End this turn if a fresh session is needed.']);
  writeFileSync(join(runDir, `${stage}.jsonl`), run.stdout ?? '');
  writeFileSync(join(runDir, `${stage}.stderr.log`), run.stderr ?? '');
  if (run.error) throw new Error(`Runner error during ${stage}: ${run.error.code ?? 'could not start Codex'}.`);
  const events = (run.stdout ?? '').split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));
  const terminal = events.findLast(event => event.type === 'turn.completed');
  if (run.status !== 0 || !terminal?.usage) {
    throw new Error(`Runner error during ${stage}: exit ${run.status}, no successful terminal event with usage. See local traces.`);
  }
  const items = events.filter(event => event.type === 'item.completed').map(event => event.item);
  const lastMessage = items.findLast(item => item.type === 'agent_message');
  writeFileSync(join(runDir, `${stage}.final.txt`), lastMessage?.text ?? '');
  writeFileSync(join(runDir, `${stage}.usage.json`), JSON.stringify(terminal.usage, null, 2) + '\n');
  if (!items.some(item => item.type === 'command_execution' && item.exit_code === 0 && item.command?.includes('SKILL.md'))) {
    throw new Error(`Runner error during ${stage}: no successful setup-skill read. See local traces.`);
  }
  return { usage: terminal.usage, items };
}

function isCicada(entry) {
  return entry.name === server || entry.transport?.url === endpoint;
}

const before = registrations();
if (before.some(isCicada)) throw new Error('Precondition failed: the disposable home already has a Cicada Guide registration.');
const first = runSetup('register', 'workspace-write');
const saved = registrations();
const entries = saved.filter(isCicada);
if (entries.length !== 1 || !entries[0].enabled || entries[0].transport?.url !== endpoint ||
    entries[0].transport?.bearer_token_env_var || entries[0].transport?.http_headers ||
    entries[0].transport?.env_http_headers) {
  throw new Error('Behavior failure: setup did not save one enabled anonymous Cicada Guide registration.');
}
if (JSON.stringify(before) !== JSON.stringify(saved.filter(entry => !isCicada(entry)))) {
  throw new Error('Behavior failure: setup modified an unrelated MCP registration.');
}
const savedConfig = readFileSync(configPath);
const second = runSetup('reuse', 'read-only');
const successfulCalls = second.items.filter(item => item.type === 'mcp_tool_call' &&
  item.server === entries[0].name && item.status === 'completed' && !item.error && !item.result?.is_error);
const lookup = successfulCalls.findIndex(item => item.tool === 'list_states' &&
  item.result?.structured_content?.items?.some(state => state.id && state.name));
if (lookup < 0 || !successfulCalls.slice(lookup + 1).some(item =>
  item.tool === 'show_status' && item.result?.structured_content?.kind === 'information')) {
  throw new Error('Behavior failure: the fresh session did not return states followed by an informational status.');
}
if (!savedConfig.equals(readFileSync(configPath)) || JSON.stringify(saved) !== JSON.stringify(registrations())) {
  throw new Error('Behavior failure: rerunning setup changed Codex configuration.');
}
const result = {
  status: 'passed', source, model: values.model, cli: codex(['--version']).stdout.trim(),
  setupSha256: createHash('sha256').update(readFileSync(setupSkill)).digest('hex'),
  register: first.usage, reuse: second.usage,
};
writeFileSync(join(runDir, 'result.json'), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify(result, null, 2));
