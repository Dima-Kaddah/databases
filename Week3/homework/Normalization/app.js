const mysql = require('mysql');
const util = require('util');
const fs = require('fs');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'userdb',
});

const connect = util.promisify(connection.connect.bind(connection));
const executeQuery = util.promisify(connection.query.bind(connection));
const readFile = util.promisify(fs.readFile);

async function seedDatabase() {
  const create_members_table = `CREATE TABLE IF NOT EXISTS members (
    member_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    member_name VARCHAR(20) NOT NULL,
    member_address VARCHAR(40))ENGINE=INNODB;`;

  const create_dinners_table = `CREATE TABLE IF NOT EXISTS dinners(
      dinner_id VARCHAR(11) NOT NULL PRIMARY Key,
      dinner_date DATE,
      venue_code VARCHAR(11) NOT NULL,
      venue_description VARCHAR(20) NOT NULL)ENGINE=INNODB;`;

  const create_foods_table = `CREATE TABLE IF NOT EXISTS foods(
    food_id TINYINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY Key,
    food_code VARCHAR(10) NOT NULL,
    food_description VARCHAR(20) NOT NULL)ENGINE = INNODB;`;

  const create_reservations_table = `CREATE TABLE IF NOT EXISTS reservations(
        member_id TINYINT UNSIGNED NOT NULL,
        dinner_id VARCHAR(11) NOT NULL,
        food_id TINYINT UNSIGNED NOT NULL,
        CONSTRAINT fk_member
        FOREIGN KEY (member_id)
        REFERENCES members(member_id) ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT fk_dinner
        FOREIGN KEY (dinner_id)
        REFERENCES dinners(dinner_id) ON UPDATE CASCADE ON DELETE RESTRICT,
        CONSTRAINT fk_food
        FOREIGN KEY (food_id)
        REFERENCES foods(food_id) ON UPDATE CASCADE ON DELETE RESTRICT)ENGINE=INNODB;`;

  try {
    await connect();
    await executeQuery(create_members_table);
    await executeQuery(create_dinners_table);
    await executeQuery(create_foods_table);
    await executeQuery(create_reservations_table);

    const membersData = await readFile(__dirname + '/member.json', 'utf8');
    const members = JSON.parse(membersData);
    const mPromises = members.map(member =>
      executeQuery(`INSERT INTO members SET ?`, member),
    );

    const dinnersData = await readFile(__dirname + '/dinner.json', 'utf8');
    const dinners = JSON.parse(dinnersData);
    const dPromises = dinners.map(dinner =>
      executeQuery(`INSERT INTO dinners SET ?`, dinner),
    );

    const foodData = await readFile(__dirname + '/food.json', 'utf8');
    const foods = JSON.parse(foodData);
    const fPromises = foods.map(food =>
      executeQuery(`INSERT INTO foods SET ?`, food),
    );

    const reservationDtat = await readFile(
      __dirname + '/reservations.json',
      'utf8',
    );

    const reservations = JSON.parse(reservationDtat);
    const rPromises = reservations.map(reservation =>
      executeQuery(`INSERT INTO reservations SET ?`, reservation),
    );

    await Promise.all(mPromises, dPromises, fPromises, rPromises);

    connection.end();
  } catch (error) {
    console.error(error);
    connection.end();
  }
}

seedDatabase();
