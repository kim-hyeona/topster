'use strict';

function createHandler({ getKey = () => process.env.LASTFM_API_KEY, fetchImpl = (...args) => fetch(...args) } = {}) {
  return async function handler(req, res) {
    const send = (status, data) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(data));
    };
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return send(405, { error: 'Method not allowed' });
    }
    const params = new URL(req.url, 'https://topster.invalid').searchParams;
    const query = params.get('q')?.trim();
    if (!query || query.length > 200) return send(400, { error: '검색어를 확인해 주세요' });
    const key = getKey();
    if (!key) return send(503, { error: '검색 서비스 설정이 필요합니다' });
    const url = new URL('https://ws.audioscrobbler.com/2.0/');
    url.search = new URLSearchParams({ method: 'album.search', album: query,
      api_key: key, format: 'json', limit: '30' }).toString();
    try {
      const response = await fetchImpl(url.toString(), {
        signal: AbortSignal.timeout(10000), redirect: 'error',
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      if (data.error) throw new Error('Search failed');
      const albums = data.results?.albummatches?.album;
      if (!Array.isArray(albums)) throw new Error('Invalid search response');
      // Only public album fields are returned. Never forward upstream errors/URLs.
      const clean = albums.slice(0, 30).map(album => ({
        name: typeof album.name === 'string' ? album.name : '',
        artist: typeof album.artist === 'string' ? album.artist : '',
        image: Array.isArray(album.image) ? album.image.map(image => ({
          '#text': typeof image['#text'] === 'string' && /^https:\/\//.test(image['#text']) ? image['#text'] : '',
        })) : [],
      }));
      return send(200, { results: { albummatches: { album: clean } } });
    } catch {
      return send(502, { error: '검색 실패. 잠시 후 다시 시도해주세요.' });
    }
  };
}

module.exports = createHandler();
module.exports.createHandler = createHandler;
