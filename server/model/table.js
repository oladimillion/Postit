import Sequelize from "sequelize" ;
import config from './config.json';

const env = process.env.NODE_ENV || 'development';
const connection = new Sequelize("postit", "postgres", "password", config[env]);

export default function Connection (){
  //table for the users
  connection.query(`CREATE TABLE IF NOT EXISTS users 
    (username VARCHAR(30) UNIQUE, password VARCHAR(30), 
    email VARCHAR(30) UNIQUE, phone VARCHAR(100) UNIQUE)`, { 
      type: connection.QueryTypes.CREATE 
    })
    .then(user => {
      console.log("users table created");
    })
    .catch((err) => {
      console.log(err);
      console.log("users table not created");
    });
  
  //table for groups
  connection.query(`CREATE TABLE IF NOT EXISTS groups 
    (group_id INTEGER UNIQUE DEFAULT 0, group_name VARCHAR(30) UNIQUE, 
    group_admin VARCHAR(30))`, { 
      type: connection.QueryTypes.CREATE 
    })
    .then(groups => {
      console.log("group table created");
    })
    .catch((err) => {
      console.log("group table not created");
    });
  
  //table for messages
  connection.query(`CREATE TABLE IF NOT EXISTS messages 
    (msg_count INTEGER DEFAULT 0, msg_id INTEGER DEFAULT 0,
    group_id INTEGER, sender_name VARCHAR(30), 
    message VARCHAR(1000))`, { 
      type: connection.QueryTypes.CREATE 
    })
    .then(msg => {
      console.log("messages table created");
    })
    .catch((err) => {
      console.log("messages table not created");
    });

  //table for user_groups
  connection.query(`CREATE TABLE IF NOT EXISTS user_groups 
      (group_id INTEGER, username VARCHAR(30) UNIQUE)`, { 
      type: connection.QueryTypes.CREATE 
      })
    .then(msg => {
      console.log("user_groups table created");
    })
    .catch((err) => {
      console.log("user_groups table not created");
    });

    //table for read_msg    
  connection.query(`CREATE TABLE IF NOT EXISTS read_msg 
    (msg_id INTEGER, group_id INTEGER, 
      username VARCHAR(30) UNIQUE)`, { 
    type: connection.QueryTypes.CREATE 
    })
    .then(msg => {
      console.log("read_msg table created");
    })
    .catch((err) => {
      console.log("read_msg table not created");
    });
  
  return connection;
  
}