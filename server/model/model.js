const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];
const connection = new Sequelize("postit", "postgres", "1234", config);

connection.query(`CREATE TABLE IF NOT EXISTS users 
    (username VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, 
    email VARCHAR(30) NOT NULL, phone VARCHAR(30) NOT NULL, 
    groupids VARCHAR(30), UNIQUE(username,email,phone))`, { type: connection.QueryTypes.CREATE })
    .then(user => {
        console.log("users table created");
    })
    .catch((error) => {
        console.log(error);
        console.log("users table not created");
    });

connection.query(`CREATE TABLE IF NOT EXISTS groups 
    (groupid INTEGER, groupname VARCHAR(30) NOT NULL, UNIQUE(groupname))`, { type: connection.QueryTypes.CREATE })
    .then(groups => {
        console.log("group table created");
    })
    .catch((error) => {
        console.log("group table not created");
    });

connection.query(`CREATE TABLE IF NOT EXISTS messages 
    (msgcount INTEGER, groupid INTEGER NOT NULL, username VARCHAR(30) NOT NULL, 
        message VARCHAR(1000) NOT NULL)`, { type: connection.QueryTypes.CREATE })
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
            callback("Registration Successful");
        })
        .catch((error) => {
            if (error.name === "SequelizeUniqueConstraintError") {
                callback("Username, Email or Phone already exists");
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
                callback("User does not exist");
            } else {
                callback("You are logged in");
            }
        })
        .catch((error) => {
            if (error.name === "SequelizeDatabaseError") {
                callback("Enter invalid input");
            } else {
                callback({ login: error });
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
                callback("Enter invalid input");
            } else {
                callback(error);
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
            callback(error);
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
            callback("User already in this group");
            return;
        }

        groupids += " " + groupId;
        connection.query(`UPDATE users SET groupids = ? WHERE username = ?`, {
                replacements: [groupids, username],
                type: connection.QueryTypes.UPDATE
            })
            .then(done => {
                callback("user added to group");
            })
            .catch((error) => {
                callback(error);
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
                    callback("Group created");
                });
            })
            .catch((error) => {
                if (error.name === "SequelizeUniqueConstraintError") {
                    callback("Group name already exists");
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
                callback("Message sent");
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