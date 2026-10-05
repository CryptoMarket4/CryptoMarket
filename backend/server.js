const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === "GET" && req.url === "/api/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "ok",
      service: "CryptoMarket Payment Backend"
    }));
  }

  if (req.method === "POST" && req.url === "/api/payment/create") {
    res.writeHead(501);
    return res.end(JSON.stringify({
      status: "not_configured",
      message: "Payment provider is not connected yet."
    }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({
    error: "Not found"
  }));
});

server.listen(PORT, () => {
  console.log(`CryptoMarket backend running on port ${PORT}`);
});
