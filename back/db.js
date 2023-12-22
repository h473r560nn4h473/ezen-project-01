const db = {
    database: "PETERAN",
    connectionLimit: 10,
    host: "127.0.0.1",
    user: "root",
    password: "1234",
    // multipleStatements : true
  };
const dbPool = require('mysql').createPool(db);

module.exports = dbPool;