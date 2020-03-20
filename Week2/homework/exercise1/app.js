// **Exercise 1: Keys**
// 1. Create a table, called `Authors`. Give it the following fields: `(author_no(Primary Key), author_name, university, date_of_birth, h_index, gender)`
// 2. Write a query that adds a `foreign key` column to `Authors` table that references the column `author_no`.
// Call this column `Friend`.

const mysql = require('mysql');
const util = require('util');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const executeQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const create_authors_table = `CREATE TABLE IF NOT EXISTS Authors (
    author_no int NOT NULL AUTO_INCREMENT,
    author_name varchar(50),
    university varchar(50),
    date_of_birth DATE,
    h_index int,
    gender enum('f','m'),
    CONSTRAINT PK_Authors PRIMARY KEY (author_no));`;
  const add_friend_column = `ALTER TABLE Authors ADD COLUMN Friend int;`;
  const add_foreign_key = `ALTER TABLE Authors ADD CONSTRAINT
   FK_Authors FOREIGN KEY(Friend) REFERENCES Authors(author_no);`;

  connection.connect();

  try {
    await Promise.all[
      (executeQuery(create_authors_table),
      executeQuery(add_friend_column),
      executeQuery(add_foreign_key))
    ];
    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
