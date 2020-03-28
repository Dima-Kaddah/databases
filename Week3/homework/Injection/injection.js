const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});

conn.connect();

function getPopulation(country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${country} WHERE Name = '${name}' and code = ${code}`,
    function(err, result) {
      if (err) cb(err);
      if (result.length === 0) cb(new Error('Not found'));
      cb(null, result[0].name);
    },
  );
  conn.end();
}

getPopulation('country', 'Netherlands', 'NLD', (err, result) => {
  if (err) console.error(err.message);
  else console.log(`Population: ${result}`);
});
