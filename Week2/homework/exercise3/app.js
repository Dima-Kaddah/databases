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
  const collaborators = `select a.author_name, r.paper_title from authors as A, Research_Papers as R where A.author_no = R.author;`;
  const collaborators2 = `select a.paper_title, r.author_name from Research_Papers as A, authors as R where A.author = R.author_no;`;
  const leftJoin = `select * from authors as A left join Research_Papers as r on r.author = a.author_no;`;

  connection.connect();

  try {
    console.log(await executeQuery(collaborators));
    console.log(await executeQuery(collaborators2));
    console.log(await executeQuery(leftJoin));

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
