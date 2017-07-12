import Connection from "./table";// imports table

const connection = Connection(); // Sequelize connection

export function RegUser(userObj, callback) {
  connection.query(`INSERT into users (username, password, phone, email, groupids)
    VALUES (?,?,?,?)`, {
      replacements: [userObj.username, userObj.password,
        userObj.phone, userObj.email
      ],
      type: connection.QueryTypes.INSERT
    })
    .then(user => {
      callback({ success: true, message: "Registration Successful" });
    })
    .catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        callback({ success: false, message: "Username, Email or Phone already exists" });
      } else {
        throw err;
      }
    });
}

export function FindOneUser(userObj, callback) {
  connection.query(`SELECT username FROM users WHERE username = ? and password = ?`, {
      replacements: [userObj.username, userObj.password],
      type: connection.QueryTypes.SELECT
    })
    .then((user) => {
      if (user.length === 0) {
        callback({ success: false, message: "User does not exist" });
      } else {
        callback({ success: true, message: "Welcome" });
      }
    })
    .catch((err) => {
      if (err.name === "SequelizeDatabaseError") {
        callback({ success: false, message: "Enter invalid input" });
      } else {
        throw err;
      }
    });
}

export function FindAllUser(callback) {
  connection.query(`SELECT * FROM users`, { type: connection.QueryTypes.SELECT })
    .then(user => {
      callback(user);
    })
    .catch((err) => {
      if (err.name === "SequelizeDatabaseError") {
        callback({ success: false, message: "Enter invalid input" });
      } else {
        throw err;
      }
    });
}

export function UserGroup(username, callback) {
  connection.query(`SELECT group_id FROM user_groups
   WHERE username = ? `, {
        replacements: [username],
        type: connection.QueryTypes.SELECT
    })
    .then(groupids => {
      // return console.log(groupids)
      callback(groupids);
    })
    .catch((err) => {
      throw err;
    });
}

export function AddUserToGroup( group_id, username, callback) {
  
  connection.query(`INSERT into user_groups 
  (group_id, username) VALUES (?,?)`, {
    replacements: [group_id, username],
      type: connection.QueryTypes.INSERT
    })
    .then(done => {
      callback({ success: true, 
        message: username + " added to group" });
    })
    .catch((err) => {
      if (err.name === "SequelizeDatabaseError") {
        callback({ success: false, 
          message: username + " already in this group" });
      } else {
        throw err;
      }
    });
 }

export function TotalNumGroups(callback) {
  connection.query(`SELECT COUNT(group_name) FROM groups`, {
      type: connection.QueryTypes.SELECT
    })
    .then((total) => {
      callback(total);
    })
    .catch((err) => {
      throw err;
    });
}

export function CreateNewGroup( group_name, username, callback) {
  
  connection.query(`INSERT into groups 
  (group_id, group_name, group_admin) 
  VALUES ((SELECT COUNT(group_id) FROM groups)+1,?,?)`, {
    replacements: [group_name, username],
      type: connection.QueryTypes.INSERT
    })
    .then(data => {
      AddUserToGroup(`SELECT COUNT(group_id) FROM groups`, 
      username, (data) => {
        callback({ success: true, message: "Group created" });
      });
    })
    .catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        callback({ 
          success: false, 
          message: "Group name already exists" 
        });
      } else {
        throw err;
      }
    });

}

//TO DO
function CountUserMsg(groupid, username, callback){
  connection.query(`SELECT COUNT(message) 
    FROM messages WHERE groupid = ? AND username = ?`, {
    replacements: [groupid, username],
    type: connection.QueryTypes.SELECT
  })
  .then((numUserMsg) => {
    callback(numUserMsg);
  })
  .catch((err) => {
    throw err;
  });
}

//TO DO
function CountGroupMsg(groupid, callback) {
  connection.query(`SELECT COUNT(message) 
    FROM messages WHERE groupid = ?`, {
      replacements: [groupid],
      type: connection.QueryTypes.SELECT
    })
    .then(numGrpMsg => {
      callback(numGrpMsg);
    })
    .catch((err) => {
      throw err;
    });
}

export function PostMessage(messageObj, callback) {
  
  connection.query(`INSERT into messages 
  (msg_count, msg_id, group_id, sender_name, message) // TO DO
    VALUES (
    (SELECT COUNT(msg_count) FROM messages WHERE group_id = ? ) + 1, 
    (SELECT COUNT(msg_id) FROM messages WHERE
    group_id = ?  AND sender_name = ?) + 1, ?, ?)`, {
      replacements: [messageObj.group_id, 
        messageObj.group_id, 
        messageObj.username,
        messageObj.username, 
        messageObj.message
      ],
      type: connection.QueryTypes.INSERT
    })
    .then(msg => {
      callback({ success: true, message: "Message sent"});
    })
    .catch((err) => {
      throw err;
    });
  
}

export function MsgReader(msg_id, group_id, username, next){

  connection.query(`INSERT into read_msg 
  (msg_id, group_id, username) 
  VALUES (?,?,?)`, {
    replacements: [msg_id, group_id, username],
      type: connection.QueryTypes.INSERT
    })
    .then(data => {
     next();
    })
    .catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        next();
      } else {
        throw err;
      }
    });
  
}

export function GetMsgReader(msg_id, group_id, next){
  
  connection.query(`SELECT FROM read_msg 
  (username) WHERE msg_id = ? AND group_id = ?)`, {
    replacements: [msg_id, group_id],
      type: connection.QueryTypes.SELECT
    })
    .then(data => {
      next();
    })
    .catch((err) => {
        throw err;
    });
  
}

export function FindGroupMsg(group_id, callback) {
  connection.query(`SELECT message FROM messages WHERE group_id = ?`, { replacements: [group_id], type: connection.QueryTypes.SELECT })
    .then(msg => {
      callback(msg);
    })
    .catch((err) => {
      throw err;
    });
}


