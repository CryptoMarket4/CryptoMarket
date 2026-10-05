const http = require("http");

const PORT = process.env.PORT || 10000;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    return res.end();
  }

  // Health check
  if (req.method === "GET" && req.url === "/api/health") {
    return sendJson(res, 200, {
      status: "ok",
      service: "CryptoMarket Payment Backend"
    });
  }

  // Payment creation endpoint
  if (req.method === "POST" && req.url === "/api/payment/create") {
    try {
      const data = await readBody(req);

      const amountEUR = Number(data.amountEUR);
      const crypto = String(data.crypto || "").trim();

      if (!Number.isFinite(amountEUR) || amountEUR <= 0) {
        return sendJson(res, 400, {
          status: "error",
          message: "Invalid EUR amount."
        });
      }

      if (!crypto) {
        return sendJson(res, 400, {
          status: "error",
          message: "Crypto asset is required."
        });
      }

      return sendJson(res, 501, {
        status: "not_configured",
        message: "Payment provider is not connected yet.",
        amountEUR,
        crypto
      });

    } catch {
      return sendJson(res, 400, {
        status: "error",
        message: "Invalid request."
      });
    }
  }

  return sendJson(res, 404, {
    error: "Not found"
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`CryptoMarket backend running on port ${PORT}`);
});
