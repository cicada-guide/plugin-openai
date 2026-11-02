import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';

const destination = resolve('.plugin-eval/answers');
mkdirSync(destination, { recursive: true });
const seen = new Map();
function capture() {
  for (const name of readdirSync(tmpdir()).filter(name => /^plugin-eval-case-[1-8]-/.test(name))) {
    const answer = resolve(tmpdir(), name, 'workspace/answer.md');
    try {
      if (!existsSync(answer)) continue;
      const text = readFileSync(answer, 'utf8');
      if (seen.get(name) === text) continue;
      writeFileSync(resolve(destination, `${name}.md`), text);
      seen.set(name, text);
      console.log(`Captured ${name}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
}
capture();
setInterval(capture, 250);
