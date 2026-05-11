function logPanel(data) {
  const time = new Date().toISOString();

  console.log("\n================= AGENT DEBUG PANEL =================");
  console.log(`[TIME] ${time}`);
  console.log(`[TYPE] ${data.type}`);

  if (data.tool) {
    console.log(`[TOOL] ${data.tool}`);
  }

  if (data.input) {
    console.log(`[INPUT] ${JSON.stringify(data.input)}`);
  }

  if (data.output) {
    console.log(`[OUTPUT] ${JSON.stringify(data.output)}`);
  }

  if (data.latency !== undefined) {
    console.log(`[LATENCY] ${data.latency}ms`);
  }

  if (data.error) {
    console.log(`[ERROR] ${data.error}`);
  }

  console.log("====================================================\n");
}

module.exports = { logPanel };