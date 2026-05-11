const { generateResponse } = require("./aiService");
const { runTool } = require("./tools");

async function runAgent(messages) {
  // STEP 1: Planner (decide tool or chat)
  const plannerPrompt = [
    {
      role: "system",
      content:
        `You are an agent planner.
Return ONLY JSON in this format:
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
  } catch {
    return decisionRaw; // fallback normal chat
  }

  // STEP 2: TOOL EXECUTION
  if (decision.action === "tool") {
    const toolResult = await runTool(decision.tool, decision.input);

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

    return await generateResponse(finalPrompt);
  }

  // STEP 3: NORMAL CHAT
  return await generateResponse(messages);
}

module.exports = { runAgent };