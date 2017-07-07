const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];
const connection = new Sequelize("postit", "postgres", "1234", config);

connection.query(`CREATE TABLE IF NOT EXISTS users 
(username VARCHAR(30) UNIQUE, password VARCHAR(30) , 
email VARCHAR(30) UNIQUE, phone VARCHAR(30) UNIQUE, 
    groupids VARCHAR(30))`, { type: connection.QueryTypes.CREATE })
    .then(user => {
        console.log("users table created");
    })
    .catch((error) => {
        console.log(error);
        console.log("users table not created");
    });
//, UNIQUE(groupid, groupname)
connection.query(`CREATE TABLE IF NOT EXISTS groups 
(groupid INTEGER UNIQUE, groupname VARCHAR(30) UNIQUE)`, { type: connection.QueryTypes.CREATE })
    .then(groups => {
        console.log("group table created");
    })
    .catch((error) => {
        console.log("group table not created");
    });

connection.query(`CREATE TABLE IF NOT EXISTS messages 
(msgcount INTEGER, groupid INTEGER, username VARCHAR(30) , 
        message VARCHAR(1000) )`, { type: connection.QueryTypes.CREATE })
    .then(msg => {
        console.log("messages table created");
    })
    .catch((error) => {
        console.log("messages table not created");
    });

function RegUser(userObj, callback) {
    connection.query(`INSERT into users (username, password, phone, email, groupids)
        VALUES (?,?,?,?,?)`, {
            replacements: [userObj.username, userObj.password,
                userObj.phone, userObj.email, ""
            ],
            type: connection.QueryTypes.INSERT
        })
        .then(user => {
            callback({ success: true, message: "Registration Successful" });
        })
        .catch((error) => {
            if (error.name === "SequelizeUniqueConstraintError") {
                callback({ success: false, message: "Username, Email or Phone already exists" });
            } else {
                Error(error);
            }
        });
}

function FindOneUser(userObj, callback) {
    connection.query(`SELECT * FROM users WHERE username = ? and password = ?`, {
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
        .catch((error) => {
            if (error.name === "SequelizeDatabaseError") {
                callback({ success: false, message: "Enter invalid input" });
            } else {
                Error(error);
            }
        });
}

function FindAllUser(callback) {
    connection.query(`SELECT * FROM users`, { type: connection.QueryTypes.SELECT })
        .then(user => {
            callback(user);
        })
        .catch((error) => {
            if (error.name === " SequelizeDatabaseError") {
                callback({ success: false, message: "Enter invalid input" });
            } else {
                Error(error);
            }
        });
}

function UserGroup(username, callback) {
    connection.query(`SELECT groupids FROM users WHERE username = ? `, {
            replacements: [username],
            type: connection.QueryTypes.SELECT
        })
        .then(groupids => {
            callback(groupids);
        })
        .catch((error) => {
            Error(error);
        });
}

function AddUserToGroup(username, groupId, callback) {
    UserGroup(username, (groupids) => {
        groupId = String(groupId);
        groupids = groupids[0].groupids;
        if (!groupids) {
            groupids = "";
        }
        let groupArray = [];
        groupArray = groupids;

        let index = groupArray.split(" ").indexOf(groupId);

        if (index != -1) {
            callback({ success: false, message: "User already in this group" });
            return;
        }

        groupids += " " + groupId;
        connection.query(`UPDATE users SET groupids = ? WHERE username = ?`, {
                replacements: [groupids, username],
                type: connection.QueryTypes.UPDATE
            })
            .then(done => {
                callback({ success: true, message: "user added to group" });
            })
            .catch((error) => {
                Error(error);
            });
    });
}

function TotalNumGroups(callback) {
    connection.query(`SELECT COUNT(groupname) FROM groups`, {
            type: connection.QueryTypes.SELECT
        })
        .then((total) => {
            callback(total);
        })
        .catch((error) => {
            Error(error);
        });
}

function CreateNewGroup(username, groupname, callback) {
    TotalNumGroups((total) => {
        total = Number(total[0].count);
        total += 1;
        connection.query(`INSERT into groups (groupid, groupname) VALUES (?,?)`, {
                replacements: [total, groupname],
                type: connection.QueryTypes.INSERT
            })
            .then(data => {
                AddUserToGroup(username, total, (data) => {
                    callback({ success: true, message: "Group created" });
                });
            })
            .catch((error) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    callback({ success: false, message: "Group name already exists" });
                } else {
                    Error(error);
                }
            });
    });
}

function CountGroupMsg(groupid, callback) {
    connection.query(`SELECT COUNT(message) FROM messages WHERE groupid = ?`, {
            replacements: [groupid],
            type: connection.QueryTypes.SELECT
        })
        .then(numGrpMsg => {
            callback(numGrpMsg);
        })
        .catch((err) => {
            Error(err);
        });
}

function PostMessage(messageObj, callback) {
    CountGroupMsg(messageObj.groupid, (numGrpMsg) => {
        numGrpMsg = Number(numGrpMsg[0].count);
        numGrpMsg += 1;
        connection.query(`INSERT into messages (msgcount, groupid, username, message) VALUES (?,?,?,?)`, {
                replacements: [numGrpMsg, messageObj.groupid, messageObj.username,
                    messageObj.message
                ],
                type: connection.QueryTypes.INSERT
            })
            .then(msg => {
                callback({ success: true, message: "Message sent" });
            })
            .catch((error) => {
                Error(error);
            });
    });
}

function FindGroupMsg(groupid, callback) {
    connection.query(`SELECT message FROM messages WHERE groupid = ?`, { replacements: [groupname], type: connection.QueryTypes.SELECT })
        .then(msg => {
            callback(msg);
        })
        .catch((err) => {
            Error(err);
        });
}

function Error(err) {
    throw err;
}

module.exports = {
    RegUser: RegUser,
    FindOneUser: FindOneUser,
    FindAllUser: FindAllUser,
    AddUserToGroup: AddUserToGroup,
    CreateNewGroup: CreateNewGroup,
    PostMessage: PostMessage,
    FindGroupMsg: FindGroupMsg,
}