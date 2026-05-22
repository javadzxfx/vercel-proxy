export default async function handler(req, res) {
  // یک مسیر اختصاصی برای پروکسی تا با ترافیک معمولی وب تداخل نکند
  if (req.url.startsWith('/ws-proxy')) {
    try {
      const targetUrl = new URL(req.url, 'http://localhost');
      targetUrl.hostname = '66.92.161.220';
      targetUrl.port = '8080';
      
      // هدرهای مهم برای WebSocket را فوروارد کن
      const headersToForward = ['upgrade', 'connection', 'sec-websocket-key', 'sec-websocket-version', 'host'];
      const headers = {};
      for (const h of headersToForward) {
        if (req.headers[h]) headers[h] = req.headers[h];
      }

      const response = await fetch(targetUrl.toString(), {
        method: req.method,
        headers: headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
      });
      
      res.status(response.status);
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      const data = await response.text();
      res.send(data);
    } catch (error) {
      res.status(502).send(`Proxy Error: ${error.message}`);
    }
  } else {
    // اگر کسی به مسیر اصلی آمد، یک پیام ساده بده
    res.status(200).send('Proxy is running. Use /ws-proxy path for VLESS.');
  }
}
