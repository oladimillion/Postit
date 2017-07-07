const express = require('express');
const session = require('express-session');
const morgan = require("morgan");
const bodyParser = require('body-parser');


// Start Express
let app = express();
const port = process.env.PORT || 3000;

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


// Load Routes
let router = express.Router();
// let router = Router();
require('./server/routes/routes').routes(router);
require('./server/routes/userRoutes').routes(router);
require('./server/routes/groupRoutes').routes(router);
app.use("/api", router);



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});