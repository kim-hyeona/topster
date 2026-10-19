const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHandler } = require('../api/albums.js');

async function run(handler, url = '/api/albums?q=album', method = 'GET') {
  const res = { headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(value) { this.body = value; } };
  await handler({ url, method }, res);
  return res;
}
test('only server key reaches fixed upstream; response contains public album fields', async () => {
  const handler = createHandler({ getKey: () => 'dummy-secret', fetchImpl: async (url) => {
    const parsed = new URL(url);
    assert.equal(parsed.origin, 'https://ws.audioscrobbler.com');
    assert.equal(parsed.searchParams.get('method'), 'album.search');
    assert.equal(parsed.searchParams.get('api_key'), 'dummy-secret');
    assert.equal(parsed.searchParams.get('album'), '한글 & test');
    return { ok: true, json: async () => ({ results: { albummatches: { album: [{ name: 'album', artist: 'artist', secret: 'dummy-secret', image: [{ '#text': 'https://images.invalid/cover.jpg' }] }] } } }) };
  } });
  const res = await run(handler, '/api/albums?q=' + encodeURIComponent('한글 & test') + '&method=user.getInfo&api_key=attacker');
  assert.equal(res.statusCode, 200);
  assert.ok(!res.body.includes('dummy-secret'));
  assert.equal(JSON.parse(res.body).results.albummatches.album[0].name, 'album');
});
test('invalid methods, missing key and invalid queries do not call upstream', async () => {
  const handler = createHandler({ getKey: () => '', fetchImpl: () => { throw Error('Unexpected'); } });
  assert.equal((await run(handler)).statusCode, 503);
  assert.equal((await run(handler, '/api/albums?q=x', 'POST')).statusCode, 405);
  for (const query of ['', ' '.repeat(3), 'x'.repeat(201)]) {
    assert.equal((await run(handler, '/api/albums?q=' + encodeURIComponent(query))).statusCode, 400);
  }
});
test('upstream errors never expose secret-bearing URLs or messages', async () => {
  for (const fetchImpl of [
    async () => { throw Error('https://example.invalid?api_key=dummy-secret'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => ({ error: 10, message: 'dummy-secret' }) }),
    async () => ({ ok: true, json: async () => ({}) }),
  ]) {
    const res = await run(createHandler({ getKey: () => 'dummy-secret', fetchImpl }));
    assert.equal(res.statusCode, 502);
    assert.ok(!res.body.includes('dummy-secret'));
  }
});
