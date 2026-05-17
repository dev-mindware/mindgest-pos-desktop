const Database = require('better-sqlite3');
const db = new Database('mindgest-pos-dev.db');
const rows = db.prepare('SELECT * FROM offline_documents').all();
console.log(JSON.stringify(rows, null, 2));
