const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/bot.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memory (
      userId TEXT PRIMARY KEY,
      history TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS persona (
      userId TEXT PRIMARY KEY,
      persona TEXT
    )
  `);
});

module.exports = db;