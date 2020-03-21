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
  const numOfAuthors = `select count(author)from research_papers as R group by r.paper_title;`;
  const femaleAuthors = `select count(paper_title) from research_papers as r inner join authors as A on a.author_no=r.author where a.gender='f';`;
  const avgHindex = `select avg(h_index)from authors as a inner join research_papers as r on a.author_no=r.author;`;
  const avgHindexCountry = `select avg(h_index),country from authors as a inner join research_papers as r on a.author_no=r.author group by a.country;`;
  const numOfResPapersPerountry = `select count(r.paper_id),a.country from research_papers as r inner join authors as A on a.author_no=r.author group by a.country;`;
  const minMaxHindex = `select min(a.h_index),max(a.h_index),a.country from authors as a left join research_papers as r on a.author_no=r.author group by a.country;`;

  connection.connect();

  try {
    console.log(await executeQuery(numOfAuthors));
    console.log(await executeQuery(femaleAuthors));
    console.log(await executeQuery(avgHindex));
    console.log(await executeQuery(avgHindexCountry));
    console.log(await executeQuery(numOfResPapersPerountry));
    console.log(await executeQuery(minMaxHindex));

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
