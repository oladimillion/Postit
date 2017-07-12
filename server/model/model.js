import Connection from "./table";// imports table

const connection = Connection(); // Sequelize connection

export function RegUser(userObj, callback) {
  connection.query(`INSERT into users (username, password, phone, email)
    VALUES (?,?,?,?)`, {
      replacements: [userObj.username, userObj.password,
        userObj.phone, userObj.email
      ],
      type: connection.QueryTypes.INSERT
    })
    .then(user => {
      callback({ success: true, 
        message: "Registration Successful" });
    })
    .catch((err) => {
      if (err.name === "SequelizeUniqueConstraintError") {
        callback({ success: false,
          message: "Username, Email or Phone already exists" });
      } else {
        throw err;
      }
    });
}

export function FindOneUser(userObj, callback) {
  connection.query(`
  SELECT username FROM users 
  WHERE username = ? and password = ?`, {
      replacements: [userObj.username, userObj.password],
      type: connection.QueryTypes.SELECT
    })
    .then((user) => {
      if (user.length === 0) {
        callback({ success: false, 
          message: "Authentication failed" });
      } else {
        callback({ success: true, message: "Welcome" });
      }
    })
    .catch((err) => {
      if (err.name === "SequelizeDatabaseError") {
        callback({ success: false, message: "You entered invalid input" });
      } else {
        throw err;
      }
    });
}

export function FindAllUser(callback) {
  connection.query(`SELECT * FROM users`, { type: connection.QueryTypes.SELECT })
    .then(user => {
      console.log(user);
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
      callback(groupids);
    })
    .catch((err) => {
      throw err;
    });
}

export function GetGroupNames(usernames, callback){
  connection.query(`SELECT group_name FROM groups
  WHERE groups.group_id = user_groups.group_id 
  AND username = ? `, {
       replacements: [username],
       type: connection.QueryTypes.SELECT
   })
   .then(group_names => {
    if(group_name == 0){
      callback({
        success: false,
        message: "No group available"
      });
    }else{
      callback({success: true, message: group_names});
     }
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
      if (err.name === "SequelizeUniqueConstraintError") {
        callback({ success: false, 
          message: username + " already in this group" });
      } else {
        throw err;
      }
    });
 }

 export function TotalNumGroups(callback) {
  connection.query(`SELECT COUNT(group_id) FROM groups`, {
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

      connection.query(`INSERT into user_groups 
      (group_id, username) 
      VALUES ((SELECT group_id FROM groups 
        WHERE group_name = ?) , ?)`, {
          replacements: [group_name, username],
          type: connection.QueryTypes.INSERT
        })
        .then(data => {
          callback({ 
            success: true, 
            message: "Group created"
          });
        })
        
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

export function PostMessage(messageObj, callback) {

  connection.query(`SELECT username FROM user_groups
  WHERE group_id = ? AND username = ?`, {
    replacements: [messageObj.group_id, messageObj.username],
      type: connection.QueryTypes.SELECT
  })
  .then((result)=>{
    if(result.length === 0){
      callback({
        success: false,
        message: "You are not in this group, so can't post message"
      });
    }else{
      
      connection.query(`INSERT into messages 
      (msg_count, msg_id, group_id, sender_name, message) VALUES (
        (SELECT COUNT(msg_count) + 1 FROM messages WHERE group_id = ? ), 
        (SELECT COUNT(msg_id) + 1 FROM messages WHERE
          group_id = ?  AND sender_name = ?) , ?, ?, ?)`, {
          replacements: [messageObj.group_id, 
            messageObj.group_id, 
            messageObj.username,
            messageObj.group_id,
            messageObj.username, 
            messageObj.message
          ],
          type: connection.QueryTypes.INSERT
        })
        .then(msg => {
          callback({ success: true, message: "Message sent"});
          return;
        })
        .catch((err) => {
          throw err;
        });
      }
  });
    
}


//TO DO
export function MsgReader(username, group_id, next){

  connection.query(`INSERT INTO read_msg (msg_id, group_id, username) 
  VALUES((SELECT msg_id FROM messages 
    WHERE username = ? AND group_id = ? ORDER BY 
    group_id DESC LIMIT 1), ?, ?)`, {
      replacements: [messageObj.username, messageObj.group_id,
        messageObj.group_id, messageObj.username],
        type: connection.QueryTypes.INSERT
  });

  connection.query(`UPDATE read_msg SET username = ? 
    WHERE group_id = ?`, {
    replacements: [username, group_id],
    type: connection.QueryTypes.UPDATE
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

// TO DO
export function GetMsgReaders(msg_id, group_id, callback){
  
  connection.query(`SELECT FROM read_msg 
   WHERE msg_id = ? AND group_id = ?)`, {
    replacements: [msg_id, group_id],
      type: connection.QueryTypes.SELECT
    })
    .then(data => {
      callback({
        success: true,
        message: data
      });
    })
    .catch((err) => {
        throw err;
    });
  
}

export function FindGroupMsg(group_id, username, callback) {

  connection.query(`SELECT username FROM user_groups
  WHERE group_id = ? AND username = ?`, {
    replacements: [group_id, username],
      type: connection.QueryTypes.SELECT
  })
  .then((result)=>{
    if(result.length === 0){
      callback({
        success: false,
        message: "You are not in this group"
      });
    }else{
  
      connection.query(`SELECT message, username FROM messages 
      WHERE group_id = ?`, { replacements: [group_id], type: connection.QueryTypes.SELECT })
        .then(msg => {
          if(msg.length == 0){
            let data = {
              success: false,
              message: "No message available for this group"
            }
            callback(data);
          }else{
            callback({
              success: true,
              message: msg
            });
          }
        })
        .catch((err) => {
          throw err;
        });
    }
  });
}


