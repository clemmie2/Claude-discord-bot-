const { runCode } = require("./codeRunner");
const { webSearch } = require("./webSearch");

async function runTool(tool, input) {
  switch (tool) {
    case "code":
      return runCode(input);
    case "web":
      return webSearch(input);
    default:
      return "Unknown tool.";
  }
}

module.exports = { runTool };