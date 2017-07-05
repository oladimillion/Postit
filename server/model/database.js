const Sequelize = require("sequelize");
const connection = new Sequelize("postit", "postgres", "1234", {
    dialect: "postgres"
});

const Users = connection.define("users", {
    username: {
        type: Sequelize.STRING
    },
    phone: {
        type: Sequelize.STRING
    }
});

/*connection.sync().then(() => {
    Users.create({
        username: "dmj",
        phone: "089282200"
    });
});*/

connection.sync().then(() => {
    Users.findById(1).then((data) => {
        console.log(data.dataValues);
    });
    //logging: console.log
});