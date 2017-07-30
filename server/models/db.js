import {
	Sequelize
} from "sequelize";

import bcrypt from "bcrypt-nodejs"

import config from "../config/config.json";

const env = config["development"];

const sequelize = new Sequelize('postgres://ajczrsyb:o0Q7CfkhRuWIKYi6hi3qYbXpgsu0ksYJ@stampy.db.elephantsql.com:5432/ajczrsyb');

const db = {
	Users: sequelize.import("./users"),
	Groups: sequelize.import("./groups"),
	Messages: sequelize.import("./messages"),
	UserGroups: sequelize.import("./usergroups"),
	GroupMessages: sequelize.import("./groupmessages"),
};

// hashes users' password before it's store 
// in the database
db.Users.hook('afterValidate', (user, options) => {
	user.password =  bcrypt.hashSync(user.password);
});

// Messages' one to one associate with Groups
db.Messages.belongsTo(db.Groups, {
	foreignKey: "groupId",
})

//UserGroups' one to one association with Groups
db.UserGroups.belongsTo(db.Groups, {
	foreignKey: "groupId",
});

// UserGroups' one to one association with Users
db.UserGroups.belongsTo(db.Users, {
	foreignKey: "userId",
});

// GroupMessages' one to one association with Groups
db.GroupMessages.belongsTo(db.Groups, {
	foreignKey: "groupId",
});

// GroupMessages' one to one association with Users
db.GroupMessages.belongsTo(db.Users, {
	foreignKey: "userId",
});

// GroupMessages' one to one association with Messages
db.GroupMessages.belongsTo(db.Messages, {
	foreignKey: "messageId",
})

db.sequelize = sequelize;

export default db;