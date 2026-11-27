'use strict';
// Web server tests: real HTTP on an ephemeral port, a throwaway results store.
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

process.env.RESULTS_PATH = fs.mkdtempSync(path.join(os.tmpdir(), 'pgc-results-')) + '/results.json';

const { handler } = require('../server.js');
const http = require('node:http');

let base;
let closeServer;

before(async () => {
  const server = http.createServer(handler);
  await new Promise((resolve) => server.listen(0, resolve));
  base = `http://127.0.0.1:${server.address().port}`;
  closeServer = () => new Promise((resolve) => server.close(resolve));
});

after(async () => {
  await closeServer();
  fs.rmSync(path.dirname(process.env.RESULTS_PATH), { recursive: true, force: true });
});

async function post(pathname, body) {
  const res = await fetch(base + pathname, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

async function get(pathname) {
  const res = await fetch(base + pathname);
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    // non-JSON response (e.g. the HTML UI) — body stays null
  }
  return { status: res.status, text, body };
}

test('GET /api/questions serves the seven-level assessment', async () => {
  const res = await get('/api/questions');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.levels.length, 7);
  const total = res.body.levels.reduce((n, level) => n + level.questions.length, 0);
  assert.strictEqual(total, 56); // 8 questions × 7 levels
});

test('GET / serves the UI', async () => {
  const res = await get('/');
  assert.strictEqual(res.status, 200);
  assert.match(res.text, /Psychological G-Code/);
});

test('POST /api/assess returns the full engine report', async () => {
  const questions = (await get('/api/questions')).body;
  const responses = {};
  for (const level of questions.levels) {
    for (const q of level.questions) responses[q.id] = 3;
  }
  const { status, body } = await post('/api/assess', {
    responses,
    pillar: { mercy: [4, 4], severity: [2], balance: [3] },
  });
  assert.strictEqual(status, 200);
  assert.strictEqual(Object.keys(body.levels).length, 7);
  assert.ok(body.overallBalance > 0 && body.overallBalance <= 100);
  assert.strictEqual(body.pillar.dominant, 'mercy');
  assert.ok(body.summary.includes('dominant archetype'));
  assert.ok(body.recommendations.some((r) => r.type === 'pillar'));
});

test('POST /api/assess refuses malformed payloads', async () => {
  const { status, body } = await post('/api/assess', {});
  assert.strictEqual(status, 400);
  assert.match(body.error, /responses/);
});

test('results roundtrip: save, list, append-only', async () => {
  const questions = (await get('/api/questions')).body;
  const responses = { [questions.levels[0].questions[0].id]: 4 };
  const report = (await post('/api/assess', { responses })).body;
  const first = await post('/api/results', report);
  assert.strictEqual(first.status, 200);
  const second = await post('/api/results', report);
  const list = await get('/api/results');
  assert.strictEqual(list.body.length, 2); // appended, not overwritten
  assert.ok(list.body.every((entry) => entry.saved_at && entry.report.overallBalance !== undefined));
  assert.ok(second.body.total === 2);
});
