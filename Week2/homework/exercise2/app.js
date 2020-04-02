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
const relationshipTable = require('./Author_Papers');

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
    paper_id int PRIMARY KEY,
    paper_title varchar(50),
    publish_date DATE)`;

  // in this table we need to make composite key that mean two key are p_k in this table
  const create_Author_Papers_table = `
    CREATE TABLE IF NOT EXISTS Author_Papers (
    author_no int,
    paper_id int,
    CONSTRAINT FOREIGN KEY (author_no) REFERENCES Authors(author_no),
    CONSTRAINT FOREIGN KEY(paper_id) REFERENCES Research_Papers(paper_id),
    CONSTRAINT PK_Author_Paper PRIMARY KEY(author_no, paper_id));`;

  connection.connect();

  try {
    await executeQuery(create_Research_Papers_table);
    await executeQuery(create_Author_Papers_table);

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
    await Promise.all(
      relationshipTable.map(async relation => {
        const entry = `insert into Author_Papers set ?`;
        await executeQuery(entry, relation);
      }),
    );

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
