import { writeFileSync, mkdirSync } from 'node:fs';
const urls = ['https://cicada-guide-mcp-openai.cicada-bot.workers.dev/', 'https://cicada-guide-mcp-openai.cicada-bot.workers.dev/privacy', 'https://github.com/cicada-guide/mcp-openai/issues', 'https://cicada.guide', 'https://cicada.guide/privacy-policy', 'https://cicada.guide/terms-and-conditions', 'https://cicadaguide.featurebase.app/help'];
const pages = await Promise.all(urls.map(async url => {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(20000) });
    const html = await r.text();
    return { url, finalUrl: r.url, status: r.status, title: html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1], text: html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').slice(0, 20000), policyLinks: [...html.matchAll(/href="([^"]+)"/g)].map(m => m[1]).filter(x => /privacy|terms|support|contact/i.test(x)) };
  } catch (e) { return { url, error: e.message }; }
}));
mkdirSync('docs/evidence', { recursive: true });
writeFileSync('docs/evidence/pages.json', JSON.stringify({ checkedAt: new Date().toISOString(), pages }, null, 2) + '\n');
console.log(pages.map(({ text, ...rest }) => rest));
