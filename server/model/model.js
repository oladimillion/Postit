const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config.json')[env];
const connection = new Sequelize("postit", "postgres", "1234", config);

connection.query(`CREATE TABLE IF NOT EXISTS users 
    (id SERIAL PRIMARY KEY, username VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, 
    email VARCHAR(30) NOT NULL, phone VARCHAR(30) NOT NULL, 
    groups VARCHAR(30) NOT NULL)`, 
    { type: connection.QueryTypes.CREATE })
    .then(user => {
        console.log("users table created");
    })
    .catch((error)=>{
        console.log("users table not created");
    });

connection.query(`CREATE TABLE IF NOT EXISTS messages 
    (id SERIAL PRIMARY KEY, username VARCHAR(30) NOT NULL, groupname VARCHAR(30) NOT NULL, message VARCHAR(1000))`, 
    { type: connection.QueryTypes.CREATE })
    .then(msg => {
        console.log("messages table created");
    })
    .catch((error)=>{
        console.log("messages table not created");
    });

connection.query(`CREATE TABLE IF NOT EXISTS allgroups 
    (id SERIAL PRIMARY KEY, groupname VARCHAR(30) NOT NULL)`, 
    { type: connection.QueryTypes.CREATE })
    .then(groups => {
        console.log("all group table created");
    })
    .catch((error)=>{
        console.log("all group table not created");
    });


function regUser(userObj, callback) {
    connection.query(`INSERT into users (username, password, phone, email, groups) VALUES (?,?,?,?,?)`, {
        replacements: [userObj.username, userObj.password, 
            userObj.phone, userObj.email, userObj.groups], 
        type: connection.QueryTypes.INSERT 
    })
    .then(user => {
        callback("Done");
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}

function findOneUser(userObj, callback) {
    console.log(userObj);
    connection.query(`SELECT * FROM users WHERE username = ? and password = ?`, {
            replacements: [userObj.username, userObj.password],
            type: connection.QueryTypes.SELECT
        })
        .then((user) => {
            if (user.length > 0) {
                callback("Welcome, User logged in");
            } else {
                callback("Please enter valid username or password");
            }
        })
        .catch((error) => {
            callback(error);
        });
}

function findAllUser(callback) {
   connection.query(`SELECT * FROM users`, { type: connection.QueryTypes.SELECT })
    .then(user => {
        callback(user);
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}

function selectAll(value, table, callback){
     connection.query(`SELECT ? FROM ?`, { 
        replacements: [value, table],
        type: connection.QueryTypes.SELECT 
    })
    .then(result => {
        callback(msg);
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}


function addGroup(groupname, callback){
    connection.query(`INSERT into allgroups (groupname) VALUES (?)`, {
        replacements: [groupname], 
        type: connection.QueryTypes.INSERT 
    })
    .then(() => {
        callback("Group successfully created and inserted");
    })
    .catch((error) => {
        if(error === "SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });  
}

function createGroup(groupName, callback) {
    connection.query(`CREATE TABLE IF NOT EXISTS ${groupName.groupName}
        (id SERIAL PRIMARY KEY, username VARCHAR(30) NOT NULL, recievedMsgCount INTEGER, 
        sentMsgCount INTEGER)`, 
        {   
            type: connection.QueryTypes.CREATE 
        })
        .then(() => {
            selectAll(groupName.groupName, "allgroups", (result)=>{
                if(result > 0){
                    callback("Group already exists");
                }else{
                    addGroup(groupName.groupName, (done)=>{
                        callback(done);
                    });
                }
            });
        })
        .catch((error)=>{
            callback("group not created");
        });
}

function findGroupUsers(groupName, callback) {
    connection.query(`SELECT * FROM ?}`, { 
        replacements: [groupName],
        type: connection.QueryTypes.SELECT 
    })
    .then(msg => {
        callback(msg);
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}

function findUserGroups(username, callback){
    connection.query(`SELECT groups FROM users WHERE username = ?`, 
        {   replacements:[username],
            type: connection.QueryTypes.SELECT 
        })
        .then(msg => {
            callback(msg);
        })
        .catch((error) => {
            if(error === " SequelizeDatabaseError"){
                callback("Enter invalid input");
            }else{
                callback(error);
            }
        });
}

function createMessage(messageObj, callback) {
    connection.query(`INSERT into messages (username, groupname, message) VALUES (?,?,?)`, {
        replacements: [messageObj.username, messageObj.groupname, 
            messageObj.message], 
        type: connection.QueryTypes.INSERT 
    })
    .then(msg => {
        callback("Done");
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}
function findGroupMsg(groupName, callback) {
    connection.query(`SELECT * FROM ${groupName}`, { type: connection.QueryTypes.SELECT })
    .then(msg => {
        callback(msg);
    })
    .catch((error) => {
        if(error === " SequelizeDatabaseError"){
            callback("Enter invalid input");
        }else{
            callback(error);
        }
    });
}

module.exports = {
    regUser: regUser,
    findOneUser: findOneUser,
    findAllUser: findAllUser,
    createGroup: createGroup,
    findGroupUsers: findGroupUsers,
    createMessage: createMessage,
    findGroupMsg: findGroupMsg,
    findUserGroups:findUserGroups,
}

// findUserGroups("dimeji", (done)=>{
//     console.log(done);
// })

// createGroup("excell", (done)=>{
//     console.log(done);
// })
// findGroupMsg("excell", (done)=>{
//     console.log(done);
// })

// createMessage({username: "dimeji", groupname: "excell", message: "how far"});
// findAllUser((done)=>{
//     console.log(done);
// });

// connection.query(`SELECT * FROM users`, { type: connection.QueryTypes.SELECT })
//     .then(user => {
//         console.log(user);
//     })

// connection.query(`DROP TABLE groupName`, { type: connection.QueryTypes.DROP })
//     .then(user => {
//         console.log(user);
//     })

// connection.query(`INSERT into users (username, password, phone, email) VALUES (?,?,?,?,?)`, {
// 			replacements: ["tunji", "1234", "9988389398", "tj@tj.com"], 
// 			type: connection.QueryTypes.INSERT 
// 		})
//      .then(user => {
//          console.log(user);
//      });




// connection.drop();

// .then((data) => {
//     let value = JSON.stringify(data);
//     value = JSON.parse(value);
//     callback(value)
// })
// .catch((error) => {
//     callback("Error occured");
// });;