const express = require('express');
const session = require('express-session');
const hbs = require('hbs');
const morgan = require("morgan");
const bodyParser = require('body-parser');


// Load my and Models
//var models  = require('./models/models');


// Start Express
let app = express();
const port = process.env.PORT || 8000;

app.disable('x-powered-by');

//logs every requests
app.use(morgan('dev'));

// Use Body Parse to encode request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))


// Use Sessions
app.use(session({ secret: 'andela', resave: false, saveUninitialized: true, cookie: { maxAge: 600000 } }));


/*
 *  Middlewares
 *  Make the public folder accessible
 */
app.use(express.static('views/template'));
app.use(express.static('views/template/public/js'));
app.use(express.static('views/template/public/css'));
app.use(express.static('views/template/public/img'));
app.use(express.static('views/template/public/bootstrap'));


/*
 * Handlebars is used as the view engine
 * the views are in the view folder
 */
app.set('view engine', 'hbs');

// register the partials used for hbs
hbs.registerPartials(__dirname + '/views/partials');

//Helper Class for counter
//hbs.registerHelper("counter", index => index + 1);




// Load Routes
let router = express.Router();
// let router = Router();
require('./server/routes/routes').routes(router);
require('./server/routes/userRoutes').routes(router);
require('./server/routes/groupRoutes').routes(router);
app.use("/api", router);



app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});