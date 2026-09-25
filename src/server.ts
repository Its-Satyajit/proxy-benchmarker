import http from "node:http";
import process from "node:process";
import { serve } from "inngest/node";
import { inngest } from "./inngest/client.js";
import { updateProxiesCron } from "./inngest/functions.js";

const inngestHandler = serve({
    client: inngest,
    functions: [updateProxiesCron],
});

const server = http.createServer(async (req, res) => {
    // Health check endpoint for Railway
    if (req.url === "/" || req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            status: "OK",
            service: "proxy-benchmarker-inngest",
            timestamp: new Date().toISOString(),
        }));
        return;
    }

    // Inngest webhook endpoint
    if (req.url?.startsWith("/api/inngest")) {
        return inngestHandler(req, res);
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
});

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Inngest server listening on http://0.0.0.0:${PORT}`);
    console.log(`Inngest Endpoint: http://0.0.0.0:${PORT}/api/inngest`);
    console.log(`Health Check: http://0.0.0.0:${PORT}/health`);
});
