import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { dirname, resolve, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { parse } from 'yaml';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export function walk(dir, base = root) {
  return readdirSync(resolve(base, dir)).flatMap(name => {
    const path = posix.join(dir, name);
    const stat = lstatSync(resolve(base, path));
    if (stat.isSymbolicLink()) throw new Error(`Symlink forbidden: ${path}`);
    return stat.isDirectory() ? walk(path, base) : [path];
  });
}
export function packageFiles() {
  return ['plugin.json', 'mcp.json', 'LICENSE', 'NOTICE', ...walk('skills'), ...walk('assets')].sort();
}
export function checkFiles(files) {
  const failures = [];
  const expect = (ok, message) => { if (!ok) failures.push(message); };
  const read = p => { if (!files[p]) throw new Error(`Missing ${p}`); return Buffer.from(files[p]).toString('utf8'); };
  const plugin = JSON.parse(read('plugin.json')), mcp = JSON.parse(read('mcp.json'));
  const ajv = new Ajv2020({ allErrors: true, strict: false, validateFormats: false });
  // The portable base schema omits OpenAI's documented server extensions.
  // Validate each extension separately, then validate the transport projection
  // against the unchanged upstream schema; never silently accept extra fields.
  const extensionValidator = ajv.compile(JSON.parse(readFileSync(resolve(root, 'schemas/openai-mcp-extension.schema.json'), 'utf8')));
  const portableMcp = structuredClone(mcp);
  for (const [name, server] of Object.entries(portableMcp.mcpServers ?? {})) {
    expect(extensionValidator(server.extensions), `${name} OpenAI extension: ${JSON.stringify(extensionValidator.errors)}`);
    delete server.extensions;
  }
  for (const [name, object] of [['plugin', plugin], ['mcp', portableMcp]]) {
    const validate = ajv.compile(JSON.parse(readFileSync(resolve(root, `schemas/${name}.schema.json`), 'utf8')));
    expect(validate(object), `${name} schema: ${JSON.stringify(validate.errors)}`);
  }
  const paths = Object.keys(files);
  for (const p of paths) expect(!p.includes('\\') && !p.startsWith('/') && !p.split('/').includes('..') && !/(^|\/)(\.[^/]+|node_modules|dist)(\/|$)/.test(p), `Unsafe archive entry: ${p}`);
  expect(paths.every(p => ['plugin.json', 'mcp.json', 'LICENSE', 'NOTICE'].includes(p) || /^(skills|assets)\//.test(p)), 'Archive contains unrelated files');
  expect(plugin.name === 'cicada-guide' && plugin.version === '0.1.0', 'Unexpected identity/version');
  const openai = plugin.extensions?.['com.openai'];
  expect(!('apps' in plugin) && !('apps' in openai), 'Public package must not declare apps');
  const ui = openai.interface;
  for (const [field, max] of [['displayName', 30], ['shortDescription', 30], ['longDescription', 4000], ['developerName', 80]]) expect(typeof ui[field] === 'string' && ui[field].trim() && [...ui[field]].length <= max, `Invalid ${field}`);
  expect(ui.category === 'Education & Research', 'Wrong category');
  expect(ui.developerName === 'Forrest Satterfield', 'Wrong publisher');
  expect(Array.isArray(ui.capabilities) && ui.capabilities.every(v => typeof v === 'string'), 'Invalid capabilities');
  expect(Array.isArray(ui.defaultPrompt) && ui.defaultPrompt.length === 3 && new Set(ui.defaultPrompt).size === 3 && ui.defaultPrompt.every(p => p.trim() && p.length <= 128 && !p.includes('\n')), 'Invalid default prompts');
  for (const field of ['brandColor', 'brandColorDark']) expect(/^#[0-9A-Fa-f]{6}$/.test(ui[field]), `Invalid ${field}`);
  for (const field of ['logo', 'composerIcon', 'logoDark', 'composerIconDark']) {
    const path = ui[field]?.replace(/^\.\//, '');
    const bytes = files[path];
    expect(!!bytes && path.startsWith('assets/'), `Missing/unsafe ${field}`);
    if (bytes) {
      const b = Buffer.from(bytes);
      expect(b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])), `Not PNG: ${path}`);
      const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
      expect(w === h && w >= 256 && w <= 4096 && b.length <= 5 * 1024 * 1024, `Invalid dimensions/size: ${path}`);
    }
  }
  const servers = Object.entries(mcp.mcpServers);
  expect(servers.length === 1 && servers[0][0] === 'guide-public', 'Expected one guide-public server');
  const server = mcp.mcpServers['guide-public'];
  expect(server.type === 'streamable-http' && server.url === 'https://openai.cicada.guide/mcp', 'Wrong endpoint/transport');
  expect(!server.headers && server.extensions?.['com.openai']?.auth?.type === 'none', 'Anonymous connection requires explicit auth none and no credential headers');
  const cases = openai.review.test_cases;
  expect(cases.positive.length === 5 && cases.negative.length === 3, 'Expected five positive and three negative cases');
  for (const c of [...cases.positive, ...cases.negative]) for (const k of ['description', 'prompt']) expect(typeof c[k] === 'string' && c[k].trim(), `Invalid case ${k}`);
  for (const c of cases.positive) for (const k of ['tools_triggered', 'expected_behavior']) expect(typeof c[k] === 'string' && c[k].trim(), `Invalid positive case ${k}`);
  expect(openai.review.commerce === false && JSON.stringify(openai.publication.countries) === '["US"]' && openai.publication.release_notes.trim(), 'Wrong commerce/publication metadata');
  const skills = paths.filter(p => /^skills\/[^/]+\/SKILL\.md$/.test(p));
  expect(skills.length === 5, 'Expected five skills');
  const onboarding = openai.onboardingSkill;
  expect(typeof onboarding === 'string' && /^\.\/skills\/[^/]+\/SKILL\.md$/.test(onboarding) && !!files[onboarding.slice(2)], 'Onboarding must reference an included skill');
  const names = new Set();
  for (const p of skills) {
    const text = read(p), fm = text.match(/^---\n([\s\S]*?)\n---\n/);
    expect(!!fm && Buffer.byteLength(text) <= 1024 * 1024, `Invalid skill ${p}`);
    if (!fm) continue;
    const meta = parse(fm[1]);
    expect(meta.name === p.split('/')[1] && !names.has(meta.name) && typeof meta.description === 'string' && meta.description.trim(), `Invalid skill metadata ${p}`);
    expect(Object.keys(meta).every(k => ['name','description'].includes(k)), `Host-specific frontmatter ${p}`);
    names.add(meta.name);
  }
  for (const p of paths.filter(p => p.endsWith('.md'))) {
    const text = read(p);
    expect(!/CLAUDE_PLUGIN_ROOT|\.claude\/|mcp-anthropic|\/cicada-guide:|checking `\/mcp`/.test(text), `Stale host instruction ${p}`);
    const prose = text.replace(/```[\s\S]*?```/g, '');
    for (const m of prose.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = m[1].split('#')[0];
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const path = posix.normalize(posix.join(posix.dirname(p), target));
      expect(!!files[path], `Broken internal link ${p}: ${target}`);
    }
  }
  const missing = ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL'].filter(k => !ui[k]);
  if (!openai.review.demo_recording_url) missing.push('demo_recording_url');
  return { failures, submissionGaps: missing };
}
export function checkSource() {
  const files = Object.fromEntries(packageFiles().map(p => [p, readFileSync(resolve(root, p))]));
  const result = checkFiles(files);
  if (result.failures.length) throw new Error(result.failures.join('\n'));
  return { files, ...result };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = checkSource();
  console.log(`Package source valid: ${Object.keys(result.files).length} files. Submission gaps: ${result.submissionGaps.join(', ') || 'none'}. Host checks and publisher verification tracked separately.`);
  if (process.argv.includes('--submission') && result.submissionGaps.length) process.exitCode = 1;
}
