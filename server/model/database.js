const db = require("../model/model");


let findAllUser = db.findAllUser;


findAllUser((result) => {
    console.log(result);
});