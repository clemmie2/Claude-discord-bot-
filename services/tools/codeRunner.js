const { runCode } = require("./codeRunner");
const { webSearch } = require("./webSearch");

async function runTool(tool, input) {
  switch (tool) {
    case "code":
      return runCode(input);

    case "web":
      return await webSearch(input);

    default:
      return "Invalid tool request.";
  }
}

module.exports = { runTool };