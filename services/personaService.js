const db = require("./db");
const config = require("../config");

function getPersona(userId) {
  return new Promise((resolve) => {
    db.get("SELECT persona FROM persona WHERE userId = ?", [userId], (err, row) => {
      if (!row) return resolve(config.defaultPersona);
      resolve(row.persona);
    });
  });
}

function setPersona(userId, persona) {
  db.run(`
    INSERT INTO persona (userId, persona)
    VALUES (?, ?)
    ON CONFLICT(userId) DO UPDATE SET persona = excluded.persona
  `, [userId, persona]);
}

module.exports = { getPersona, setPersona };