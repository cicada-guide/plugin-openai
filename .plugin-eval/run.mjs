import { spawn } from 'node:child_process';
import { writeFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const evaluatorRoot = 'C:/Users/forre/.codex/plugins/cache/openai-curated-remote/plugin-eval/0.1.2';
const { runBenchmark } = await import(pathToFileURL(`${evaluatorRoot}/src/core/benchmark.js`));
const runtimeCli = process.env.CODEX_APP_RUNTIME_CLI_PATH;
if (!runtimeCli) throw new Error('CODEX_APP_RUNTIME_CLI_PATH must identify the verified desktop CLI.');
const argument = flag => {
  const index = process.argv.indexOf(flag);
  if (index < 0) return undefined;
  if (!process.argv[index + 1] || process.argv[index + 1].startsWith('--')) throw new Error(`Missing value for ${flag}`);
  return process.argv[index + 1];
};
const name = argument('--name') || (process.argv.includes('--pilot') ? 'pilot' : 'suite');
if (!/^[a-z0-9-]+$/.test(name)) throw new Error('Run name must contain only lowercase letters, digits, and hyphens.');
const configPath = argument('--config') || `.plugin-eval/${process.argv.includes('--pilot') ? 'pilot' : 'benchmark'}.json`;

async function captureProcess({ command, args, cwd, env, stdoutPath, stderrPath, kind }) {
  const start = Date.now();
  const child = spawn(command, args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
  const stdout = [], stderr = [];
  child.stdout.on('data', data => stdout.push(data));
  child.stderr.on('data', data => stderr.push(data));
  const outcome = await new Promise((resolveResult, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolveResult({ code: code ?? 1, signal }));
  });
  const stdoutText = Buffer.concat(stdout).toString('utf8');
  const stderrText = Buffer.concat(stderr).toString('utf8');
  if (stdoutPath) await writeFile(stdoutPath, stdoutText);
  if (stderrPath) await writeFile(stderrPath, stderrText);
  if (kind === 'codex') {
    // Preserve the actual answer before upstream removes the isolated workspace.
    try {
      await copyFile(resolve(cwd, 'answer.md'), resolve(dirname(stdoutPath), 'answer.md'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    console.log(`Finished ${dirname(stdoutPath)} (exit ${outcome.code})`);
  }
  return { ...outcome, stdoutText, stderrText, durationMs: Date.now() - start };
}

const result = await runBenchmark('.plugin-eval/target/skills/get-legislation', {
  configPath,
  usageOutPath: `.plugin-eval/${name}-usage.jsonl`,
  resultOutPath: `.plugin-eval/${name}-result.json`,
  codexExecutable: runtimeCli,
  processRunner: captureProcess,
});
console.log(JSON.stringify(result.summary, null, 2));
