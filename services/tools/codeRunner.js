const vm = require("vm");

function runCode(code) {
  try {
    const script = new vm.Script(code);
    const context = vm.createContext({});
    const result = script.runInContext(context);
    return String(result);
  } catch (e) {
    return "Error: " + e.message;
  }
}

module.exports = { runCode };