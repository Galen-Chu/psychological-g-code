/**
 * Psychological G-Code web server (Future Development item 1, v0.2.0).
 *
 * Node stdlib `http` only — the zero-dependency lineage holds. Serves the
 * assessment UI, the scoring engine, and a JSON-file results store:
 *
 *   GET  /                → the assessment UI (public/index.html)
 *   GET  /api/questions   → the 56 self-reflection questions (7 levels)
 *   POST /api/assess      → {responses, pillar} → full engine report
 *   POST /api/results     → save one report (append-only, timestamped)
 *   GET  /api/results      → all saved reports (track over time)
 *
 * The engine (src/assessment-engine.js) does all scoring; the server never
 * recomputes, it only transports. Results persist to data/results.json —
 * an append-only JSON array, one object per saved assessment.
 */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const AssessmentEngine = require("./src/assessment-engine.js");

const PORT = Number(process.env.PORT || 8787);
const QUESTIONS_PATH = path.join(__dirname, "data", "assessment-questions.json");
// Overridable so tests can use a throwaway store instead of the real one.
const RESULTS_PATH = process.env.RESULTS_PATH || path.join(__dirname, "data", "results.json");
const PUBLIC_DIR = path.join(__dirname, "public");

const engine = new AssessmentEngine();
const questions = JSON.parse(fs.readFileSync(QUESTIONS_PATH, "utf-8"));

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) reject(new Error("body too large"));
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function loadResults() {
  if (!fs.existsSync(RESULTS_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(RESULTS_PATH, "utf-8"));
  } catch {
    return []; // a corrupt store never blocks the assessment itself
  }
}

function saveResults(results) {
  fs.mkdirSync(path.dirname(RESULTS_PATH), { recursive: true });
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(results, null, 2), "utf-8");
}

async function handler(request, response) {
  const url = new URL(request.url, `http://${request.headers.host}`);
  try {
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(fs.readFileSync(path.join(PUBLIC_DIR, "index.html")));
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/questions") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(questions));
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/assess") {
      const payload = JSON.parse(await readBody(request));
      if (!payload.responses || typeof payload.responses !== "object") {
        throw new Error("responses must be an object of questionId → 1..5");
      }
      const pillar = payload.pillar || {};
      const report = engine.generateReport(questions, payload.responses, pillar);
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(report));
      return;
    }
    if (request.method === "POST" && url.pathname === "/api/results") {
      const report = JSON.parse(await readBody(request));
      const results = loadResults();
      const stamped = { saved_at: new Date().toISOString(), report };
      results.push(stamped);
      saveResults(results);
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ saved: stamped.saved_at, total: results.length }));
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/results") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify(loadResults()));
      return;
    }
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("not found");
  } catch (error) {
    response.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: String(error.message || error) }));
  }
}

if (require.main === module) {
  http.createServer(handler).listen(PORT, () => {
    console.log(`Psychological G-Code → http://127.0.0.1:${PORT}`);
  });
}

module.exports = { handler, loadResults, saveResults, PORT };
