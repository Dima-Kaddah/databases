// **Exercise 2: Relationships**
// 1. Create another table, called `Research_Papers` with the following fields: `(paper_id, paper_title, conference, publish_date, ...)`
// 2. What is the relationship between Authors and Research papers ? Make necessary changes to `Authors` and
// `Research_Papers` tables and add more tables if necessary.
// 3. Read exercises 3 and 4 and then add information (insert rows) of 15 authors and 30 research papers such that
// all queries in the exercises  3 and 4 will return some answers.

const mysql = require('mysql');
const util = require('util');
const authors = require('./authorsData');
const paperData = require('./ResearchPapersData');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const executeQuery = util.promisify(connection.query.bind(connection));

async function seedDatabase() {
  const create_Research_Papers_table = `
    CREATE TABLE IF NOT EXISTS Research_Papers (
    paper_id int (4) ZEROFILL NOT NULL,
    paper_title varchar(30),
    publish_date DATE,
    author int (4) ZEROFILL NOT NULL,
    CONSTRAINT FK_AUTHOR FOREIGN KEY (author) REFERENCES Authors(author_no));`;

  connection.connect();

  try {
    await executeQuery(create_Research_Papers_table);

    await Promise.all(
      authors.map(async author => {
        const entry = `insert into authors set ?`;
        await executeQuery(entry, author);
      }),
    );

    await Promise.all(
      paperData.map(async book => {
        const entry = `insert into Research_Papers set ?`;
        await executeQuery(entry, book);
      }),
    );
    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
