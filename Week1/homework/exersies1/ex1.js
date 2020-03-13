const util = require('util');
const mysql = require('mysql');

//create connection
const con = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'meetup',
});

const execQuery = util.promisify(con.query.bind(con));

async function seedDatabase() {
  const CREATE_Invitee_TABLE = ` 
    CREATE TABLE IF NOT EXISTS Invitee (
    invitee_no INT(4) ZEROFILL NOT NULL,
    invitee_name VARCHAR(50),
    invited_by VARCHAR(50)
    );`;
  const CREATE_Rooms_TABLE = `
    CREATE TABLE IF NOT EXISTS Rooms (
    room_no INT (4) ZEROFILL NOT NULL,
    room_name VARCHAR(50),
    floor_number INT (4) ZEROFILL NOT NULL
    );`;
  const CREATE_Meeting_TABLE = `
    CREATE TABLE IF NOT EXISTS Meeting (
    meeting_no INT (4) ZEROFILL NOT NULL,
    meeting_title VARCHAR(50),
    starting_time DATETIME NOT NULL,
    ending_time DATETIME NOT NULL,
    room_no INT (4) ZEROFILL NOT NULL
    );`;

  const Invitee = [
    {
      invitee_no: 1,
      invitee_name: 'Ramzi',
      invited_by: 'Dima',
    },
    {
      invitee_no: 2,
      invitee_name: 'Jala',
      invited_by: 'Wesam',
    },
    {
      invitee_no: 3,
      invitee_name: 'Hanbing',
      invited_by: 'Dima',
    },
    {
      invitee_no: 4,
      invitee_name: 'Ali',
      invited_by: 'Wesam',
    },
    {
      invitee_no: 5,
      invitee_name: 'Ibrahem',
      invited_by: 'Dima',
    },
  ];
  const Rooms = [
    { room_no: 003, room_name: 'Anna Frank', floor_number: 3 },
    { room_no: 013, room_name: 'Beethoven', floor_number: 13 },
    { room_no: 030, room_name: 'William Shakespeare', floor_number: 6 },
    { room_no: 071, room_name: 'Mahatma Gandhi', floor_number: 7 },
    { room_no: 006, room_name: 'Thomas Edison', floor_number: 9 },
  ];

  const Meeting = [
    {
      meeting_no: 15,
      meeting_title: 'make it better life',
      starting_time: '2020-03-03 09:30:00',
      ending_time: '2020-03-03 12:00:00',
      room_no: 003,
    },
    {
      meeting_no: 11,
      meeting_title: 'Exceeding the Vision',
      starting_time: '2020-04-07 10:30:00',
      ending_time: '2020-04-07 13:00:00',
      room_no: 013,
    },
    {
      meeting_no: 4,
      meeting_title: 'Anything is Possible',
      starting_time: '2020-05-06 11:30:00',
      ending_time: '2020-05-06 14:30:00',
      room_no: 030,
    },
    {
      meeting_no: 8,
      meeting_title: 'Back to the Future',
      starting_time: '2020-02-27 09:00:00',
      ending_time: '2020-02-27 11:30:00',
      room_no: 071,
    },
    {
      meeting_no: 10,
      meeting_title: 'Do Great Things',
      starting_time: '2020-03-22 11:30:00',
      ending_time: '2020-03-22 14:30:00',
      room_no: 006,
    },
  ];

  //connect
  con.connect();

  try {
    await execQuery('DROP DATABASE IF EXISTS meetup');
    await execQuery('CREATE DATABASE meetup');
    await execQuery('USE meetup');
    await execQuery(CREATE_Invitee_TABLE);
    await execQuery(CREATE_Rooms_TABLE);
    await execQuery(CREATE_Meeting_TABLE);

    Invitee.forEach(async Invitees => {
      await execQuery('insert into Invitee set ?', Invitees);
    });
    Rooms.forEach(async room => {
      await execQuery('insert into Rooms set ?', room);
    });
    Meeting.forEach(async meet => {
      await execQuery('insert into Meeting set ?', meet);
    });
  } catch (error) {
    console.error(error);
  }

  con.end();
}

seedDatabase();
