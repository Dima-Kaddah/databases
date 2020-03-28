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

async function creatTables() {
  const create_account_table = `CREATE TABLE IF NOT EXISTS account (
    account_number VARCHAR(16) NOT NULL PRIMARY KEY,
    balance INT NOT NULL) ENGINE=INNODB;`;

  const create_account_changes_table = `CREATE TABLE IF NOT EXISTS account_changes(
    change_number INT NOT NULL PRIMARY Key,
    account_number VARCHAR(16) NOT NULL,
    amount INT NOT NULL,
    changed_date DATE,
    remark ENUM('y','n'),
    INDEX (account_number),
    CONSTRAINT fk_changes_account
    FOREIGN KEY (account_number)
    REFERENCES account(account_number) ON UPDATE CASCADE ON DELETE RESTRICT)ENGINE=INNODB;`;

  try {
    await connect();
    await executeQuery(create_account_table);
    await executeQuery(create_account_changes_table);

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

creatTables();
