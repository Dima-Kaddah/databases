// **Exercise 4: Aggregate Functions**
// Write some queries to retrieve the following rows:
// 1. All research papers and the number of authors that wrote that paper.
// 2. Sum of the research papers published by all female authors.
// 3. Average of the h-index of all authors per university.//Country
// 4. Sum of the research papers of the authors per university.//Country
// 5. Minimum and maximum of the h-index of all authors per university.//Country

// i just have different name from university to Country in my data...

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
  //1
  const numOfWrAuthors = `SELECT b.paper_title,
  COUNT(DISTINCT a.author_no) 
  AS 'Authors Number'
  FROM Authors a RIGHT JOIN Author_Papers c 
  ON (a.author_no = c.author_no)
  RIGHT JOIN Research_Papers b 
  ON (c.paper_id = b.paper_id)
  GROUP BY b.paper_title;`;

  //2
  const sumRPFemale = `SELECT a.gender ,COUNT(DISTINCT b.paper_id)
  AS 'Sum of female Authors'
  FROM Authors a 
  LEFT JOIN Author_Papers c
  ON (a.author_no = c.author_no)
  LEFT JOIN Research_Papers b
  ON (c.paper_id = b.paper_id) 
  where a.gender="f";`;

  //3
  const avgHindexCountry = `SELECT AVG(a.h_index)
  AS 'average of h-index',
  a.country FROM Authors a
  group by a.country;`;

  //4
  const SumRP = `SELECT a.country ,COUNT(DISTINCT b.paper_id)
  AS 'Sum of the Research Papers'
  FROM Authors a 
  LEFT JOIN Author_Papers c 
  ON (a.author_no = c.author_no) 
  LEFT JOIN Research_Papers b 
  ON (c.paper_id = b.paper_id) 
  GROUP BY a.country;`;

  //5
  const MaxAndMinh_indx = `SELECT MIN(a.h_index)
  AS 'MIN of h-index',
  MAX(a.h_index) AS 'MAX of h-index',
  a.country FROM Authors a 
  GROUP BY a.country;`;

  connection.connect();

  try {
    console.log(await executeQuery(numOfWrAuthors));
    console.log(await executeQuery(sumRPFemale));
    console.log(await executeQuery(avgHindexCountry));
    console.log(await executeQuery(SumRP));
    console.log(await executeQuery(MaxAndMinh_indx));

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
