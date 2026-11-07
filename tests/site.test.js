'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const read = name => fs.readFileSync(path.join(root, name));
const assetPaths = [
  ...html.matchAll(/<(?:script|img|link)\b[^>]*?\b(?:src|href)="([^"]+)"/g),
].map(match => match[1]);

test('GitHub Pages root entry point and static asset paths exist', () => {
  assert.match(html, /<!doctype html>/i);
  assert.ok(fs.existsSync(path.join(root, '.nojekyll')));
  for (const url of assetPaths) {
    assert.ok(!/^(?:https?:)?\/\//.test(url), `Remote dependency: ${url}`);
    assert.ok(!url.startsWith('/'), `Site-root path breaks project pages: ${url}`);
    assert.ok(fs.existsSync(path.join(root, url)), `Missing site asset: ${url}`);
  }
});

test('entry point resolves under a project subpath', () => {
  const base = 'https://example.github.io/magic-square/';
  for (const url of assetPaths) {
    const resolved = new URL(url, base);
    assert.ok(resolved.href.startsWith(base), `Broken subpath asset: ${url}`);
  }
});

test('page has accessible interaction and mobile primitives', () => {
  assert.match(html, /<html lang="en">/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /id="square"/);
  assert.match(html, /aria-describedby="square-instructions"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /name="Trace 1 → 36"|data-mode="trace"/);
  assert.match(read('app.js').toString(), /ArrowRight/);
});

test('the illustrative artwork is a real, nonempty WebP image', () => {
  const image = read('assets/solar-square-art.webp');
  assert.ok(image.length > 100_000);
  assert.equal(image.toString('ascii', 0, 4), 'RIFF');
  assert.equal(image.toString('ascii', 8, 12), 'WEBP');
});

test('minimal deployment workflow preserves approved assets and checks production', () => {
  const workflowDir = path.join(root, '.github', 'workflows');
  assert.deepEqual(fs.readdirSync(workflowDir), ['verify.yml']);
  const workflow = read('.github/workflows/verify.yml').toString();
  assert.match(workflow, /node --test/);
  assert.ok(workflow.includes('actions/deploy-pages@v4'));
  assert.ok(workflow.includes('actions/upload-pages-artifact@v4'));
  assert.ok(workflow.includes('Confirm deployed bytes and reject unintended public files'));
  assert.ok(workflow.includes('cp index.html styles.css square.js app.js'));
  assert.ok(workflow.includes('Not published:'));
  assert.ok(!workflow.includes('pages-config:'));
  assert.ok(!workflow.includes('production-smoke:'));
  assert.ok(assetPaths.includes('square.js') && assetPaths.includes('app.js'));
  assert.ok(assetPaths.includes('styles.css'));
  assert.ok(!/\beval\s*\(/.test(read('app.js').toString()));
});


test('minimal no-JavaScript fallback preserves every source-grid cell', () => {
  const fallback = html.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(fallback, 'Fallback missing');
  assert.equal([...fallback.matchAll(/<tr>/g)].length, 6);
  assert.equal([...fallback.matchAll(/<td>\d+<\/td>/g)].length, 36);
  assert.equal([...html.matchAll(/class="insight-card"/g)].length, 2);
  assert.ok(html.indexOf('<noscript>') < html.indexOf('<section class="workbench"'));
  assert.match(fallback, /<style>\.workbench\{display:none\}<\/style>/);
});