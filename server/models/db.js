import {
	Sequelize
} from "sequelize";

import config from "../config/config.json";

const env = config["development"];

const sequelize = new Sequelize(env.database, env.username, env.password, {
	host: env.host,
	dialect: env.dialect,
	logging: false
});

const db = {
	Users: sequelize.import("./users"),
	Groups: sequelize.import("./groups"),
	Messages: sequelize.import("./messages"),
	UserGroups: sequelize.import("./usergroups"),
	GroupMessages: sequelize.import("./groupmessages"),
};

//Messages' one to one associate with Groups
db.Messages.belongsTo(db.Groups, {
	foreignKey: "groupId",
})

//UserGroups' one to one association with Groups
db.UserGroups.belongsTo(db.Groups, {
	foreignKey: "groupId",
});

//UserGroups' one to one association with Users
db.UserGroups.belongsTo(db.Users, {
	foreignKey: "userId",
});

//GroupMessages' one to one association with Groups
db.GroupMessages.belongsTo(db.Groups, {
	foreignKey: "groupId",
});

//GroupMessages' one to one association with Users
db.GroupMessages.belongsTo(db.Users, {
	foreignKey: "userId",
});

//GroupMessages' one to one association with Messages
db.GroupMessages.belongsTo(db.Messages, {
	foreignKey: "messageId",
})

db.sequelize = sequelize;

export default db;