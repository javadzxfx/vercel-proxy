export default async function handler(req, res) {
  const targetUrl = new URL(req.url, 'http://localhost');
  targetUrl.hostname = '66.92.161.220';
  targetUrl.port = '8080';
  const response = await fetch(targetUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  });
  res.status(response.status);
  res.setHeader('Access-Control-Allow-Origin', '*');
  const data = await response.text();
  res.send(data);
}
