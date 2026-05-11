const db = require("./db");

function getServerMemory(guildId) {
  return new Promise((resolve) => {
    db.get(
      "SELECT history FROM server_memory WHERE guildId = ?",
      [guildId],
      (err, row) => {
        if (!row) return resolve([]);
        try {
          resolve(JSON.parse(row.history));
        } catch {
          resolve([]);
        }
      }
    );
  });
}

function saveServerMemory(guildId, history) {
  const trimmed = history.slice(-30);

  db.run(`
    INSERT INTO server_memory (guildId, history)
    VALUES (?, ?)
    ON CONFLICT(guildId) DO UPDATE SET history = excluded.history
  `, [guildId, JSON.stringify(trimmed)]);
}

module.exports = { getServerMemory, saveServerMemory };