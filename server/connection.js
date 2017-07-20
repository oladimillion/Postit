import Sequelize from "Sequelize";

import config from "./config/config.json";

const env = config["development"];

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  logging: false
});

const db = {
  Users: sequelize.import('./models/users'),
  Groups: sequelize.import('./models/groups'),
  Messages: sequelize.import('./models/messages'),
  UserGroups: sequelize.import('./models/usergroups'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;