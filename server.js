


import express from 'express';
import session from 'express-session';
import morgan from "morgan";
import bodyParser from 'body-parser';
// import path from "path";
import UserRoutes from "./server/routes/UserRoutes";
import GroupRoutes from "./server/routes/GroupRoutes";

// Start Express
let app = express();
let router = express.Router();

// sets connection port
const port = process.env.PORT || 3000;

app.disable('x-powered-by');

//logs every requests
app.use(morgan('dev'));

// Use Body Parse to encode request to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

// Use Sessions
app.use(session({ secret: 'andela', resave: false, saveUninitialized: true, cookie: { maxAge: 600000 } }));

/*
	*  Middlewares
	*  Make the public folder accessible
*/
app.use(express.static(__dirname + '/client/dist'));
app.use(express.static(__dirname + '/template/views'));
app.use(express.static(__dirname + '/template/public/css'));
app.use(express.static(__dirname + '/template/public/img'));
app.use(express.static(__dirname + '/template/public/bootstrap'));


// check users authentication
app.get("*", (req, res, next)=>{
	if ((req.url !== '/') && (!req.session.username)) {

		console.log('checkAuth ' + req.url);
		
		return res.status(400).json({ 
			success: false,
			message: "Please login" 
		});
	}else{
		next();
	}
});

//login page route
app.get("/", (req, res) => {
	res.send("Welcome to Postit, Please login");
});

// other pages routes
app.get("/user/*", (req, res) => {
	res.send("User pages");
});

// Loads users and groups routes
UserRoutes(router);
GroupRoutes(router);

app.use("/api", router);

//starts the server
app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});