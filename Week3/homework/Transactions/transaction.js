const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const connect = util.promisify(connection.connect.bind(connection));
const executeQuery = util.promisify(connection.query.bind(connection));

async function transaction(from, to, amount) {
  try {
    await connect();
    await executeQuery(`start transaction;`);
    const fromBalance = await executeQuery(
      `select balance from account where account_number = "${from}"`,
    );
    if (fromBalance < amount) {
      await executeQuery(`rollback;`);
    } else {
      await executeQuery(
        `update account set balance = balance - ${amount} where account_number = "${from}";`,
      );
      await executeQuery(
        `update account set balance = balance + ${amount} where account_number = "${to}";`,
      );
      await executeQuery(`commit`);
      connection.end();
    }
  } catch (err) {
    console.error(err);
    connection.end();
  }
}
transaction('NL98INGB25298512', 'NL54INGB75837436', 1000);
