import fetch from 'node-fetch';

export default async function handler(req, res) {
  const marketingUrl = process.env.MARKETING_SERVICE_URL;
  if (!marketingUrl) return res.status(404).json({ error: 'Marketing service not configured' });

  // Proxy path mapping: forward path and body
  const proxyPath = req.url.replace('/api/marketing-proxy', '') || '/';
  const target = new URL(proxyPath, marketingUrl).toString();

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: { 'content-type': req.headers['content-type'] || 'application/json' },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const buffer = await upstream.arrayBuffer();
    res.status(upstream.status);
    upstream.headers.forEach((v, k) => res.setHeader(k, v));
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('marketing-proxy error', err);
    res.status(502).json({ error: String(err) });
  }
}
