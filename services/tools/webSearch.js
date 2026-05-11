const axios = require("axios");

async function webSearch(query) {
  try {
    const res = await axios.get("https://api.duckduckgo.com/", {
      params: { q: query, format: "json" }
    });

    return res.data?.AbstractText || "No results found.";
  } catch {
    return "Web search error.";
  }
}

module.exports = { webSearch };