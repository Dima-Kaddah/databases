const mysql = require('mysql');
const util = require('util');
const fs = require('fs');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const connect = util.promisify(connection.connect.bind(connection));
const executeQuery = util.promisify(connection.query.bind(connection));
const readFile = util.promisify(fs.readFile);

async function insertData() {
  try {
    await connect();

    const acountData = await readFile(__dirname + '/acount.json', 'utf8');
    const acountINfo = JSON.parse(acountData);
    const acountPromises = acountINfo.map(acut =>
      executeQuery(`INSERT INTO account SET ?`, acut),
    );

    const acountChangesData = await readFile(
      __dirname + '/acount_changes.json',
      'utf8',
    );
    const acountChangesInfo = JSON.parse(acountChangesData);
    const acountChangesPromises = acountChangesInfo.map(change =>
      executeQuery(`INSERT INTO account_changes SET ?`, change),
    );

    await Promise.all(acountPromises, acountChangesPromises);

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

insertData();
