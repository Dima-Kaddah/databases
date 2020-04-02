// **Exercise 3: Joins**
// 1. Write a query that prints names of all `authors` and their corresponding `collaborators`.
// 2. Write a query that prints all columns of `authors` and their pubished `research paper title`.
// If there is an author without any research papers, print the information of that author too.

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
  const authorsAndcollaborators = `
  select * from Authors a
  join Author_Papers c
  on (a.author_no = c.author_no)
  join Research_Papers b
  on (b.paper_id = c.paper_id);`;

  const AuthorAndPapersTitle = `
  select a.author_name,b.paper_title from Authors a
  join Author_Papers c
  on (a.author_no = c.author_no)
  join Research_Papers b
  on (b.paper_id = c.paper_id);`;

  connection.connect();

  try {
    console.log(await executeQuery(authorsAndcollaborators));
    console.log(await executeQuery(AuthorAndPapersTitle));

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
