const { generateResponse } = require("./aiService");
const { runTool } = require("./tools");
const { logPanel } = require("../utils/debugPanel");

async function runAgent(messages) {
  const startTime = Date.now();

  // STEP 1: PLAN
  const plannerPrompt = [
    {
      role: "system",
      content: `You are an agent planner.
Return ONLY valid JSON:
{
  "action": "chat | tool",
  "tool": "code | web | none",
  "input": "string"
}`
    },
    ...messages
  ];

  const decisionRaw = await generateResponse(plannerPrompt);

  let decision;
  try {
    decision = JSON.parse(decisionRaw);
  } catch (err) {
    logPanel({
      type: "planner_parse_error",
      error: decisionRaw
    });

    return decisionRaw;
  }

  logPanel({
    type: "planner_decision",
    tool: decision.tool,
    input: decision.input
  });

  // STEP 2: TOOL MODE
  if (decision.action === "tool") {
    const toolStart = Date.now();

    try {
      const toolResult = await runTool(decision.tool, decision.input);

      logPanel({
        type: "tool_execution",
        tool: decision.tool,
        input: decision.input,
        output: toolResult,
        latency: Date.now() - toolStart
      });

      const finalPrompt = [
        {
          role: "system",
          content:
            "You are a Claude-level assistant. Use tool output to answer clearly."
        },
        ...messages,
        {
          role: "assistant",
          content: `Tool result: ${toolResult}`
        }
      ];

      const final = await generateResponse(finalPrompt);

      logPanel({
        type: "final_response",
        latency: Date.now() - startTime
      });

      return final;
    } catch (err) {
      logPanel({
        type: "tool_error",
        tool: decision.tool,
        error: err.message
      });

      return "Tool execution failed.";
    }
  }

  // STEP 3: CHAT MODE
  const result = await generateResponse(messages);

  logPanel({
    type: "chat_response",
    latency: Date.now() - startTime
  });

  return result;
}

module.exports = { runAgent };