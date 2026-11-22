

// e272de1749623ec654920f924dd53a2f003c997cce65ec87039b41db86588caccacc7d68bef9aaddd4c3b8d90f2754c46a0e3a78456088ce1223ec6fb2fd7f10
const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');
console.log( db.prepare('SELECT key, iv FROM communication_encrypt WHERE identify = ? ').get('e272de1749623ec654920f924dd53a2f003c997cce65ec87039b41db86588caccacc7d68bef9aaddd4c3b8d90f2754c46a0e3a78456088ce1223ec6fb2fd7f10') );