const db = require("./db");
const config = require("../config");

function getMemory(userId) {
  return new Promise((resolve) => {
    db.get("SELECT history FROM memory WHERE userId = ?", [userId], (err, row) => {
      if (!row) return resolve([]);
      try {
        resolve(JSON.parse(row.history));
      } catch {
        resolve([]);
      }
    });
  });
}

function saveMemory(userId, history) {
  const trimmed = history.slice(-config.memory.maxMessages);

  db.run(`
    INSERT INTO memory (userId, history)
    VALUES (?, ?)
    ON CONFLICT(userId) DO UPDATE SET history = excluded.history
  `, [userId, JSON.stringify(trimmed)]);
}

module.exports = { getMemory, saveMemory };