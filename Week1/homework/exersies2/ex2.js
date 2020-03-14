const util = require('util');
const mysql = require('mysql');

//create connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});

const execQuery = util.promisify(con.query.bind(con));

async function seedDatabase() {
  //connect
  con.connect();

  try {
    await execQuery('DROP DATABASE IF EXISTS world');
    await execQuery('CREATE DATABASE world');
    await execQuery('USE world');

    //my Query1 :why the source comd only work in mysql and not here??
    //my Query2: why when i run the dump file from mysql if i back to show datatabases and use it again all the data
    //go.. until i erwrite source again???

    // await execQuery(
    //   `source /Users/doom/Desktop/databases/databases/Week1/databases/world.sql`,
    // );

    //What are the names of countries with population greater than 8 million?
    await execQuery(
      'SELECT name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10;',
    );
    //What are the names of countries that have “land” in their names?
    await execQuery("SELECT name FROM country WHERE name LIKE '%land%';");

    //What are the names of the cities with population in between 500,000 and 1 million?
    await execQuery(
      'SELECT name, population FROM city WHERE population BETWEEN 500000 AND 1000000;',
    );

    //What's the name of all the countries on the continent ‘Europe’?
    await execQuery("SELECT name FROM country WHERE continent = 'Europe';");

    //List all the countries in the descending order of their surface areas.
    await execQuery(
      'SELECT name, SurfaceArea FROM country ORDER BY SurfaceArea DESC;',
    );

    //What are the names of all the cities in the Netherlands?
    await execQuery(
      "SELECT name, countryCode from city where countryCode LIKE 'NLD';",
    );

    //What is the population of Rotterdam?
    await execQuery(
      "SELECT name, population FROM city WHERE name = 'Rotterdam';",
    );

    //What's the top 10 countries by Surface Area?
    await execQuery(
      'SELECT name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10;',
    );

    //What's the top 10 most populated cities?
    await execQuery(
      'SELECT name, population FROM city ORDER BY population DESC LIMIT 10;',
    );

    //What is the population number of the world?
    await execQuery(
      "SELECT SUM(population) AS 'Population of the World' FROM country;",
    );
  } catch (error) {
    console.error(error);
  }

  con.end();
}

seedDatabase();
