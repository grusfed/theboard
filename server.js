let http = require("http");
let express = require('express');
let app = express();
//let ejsEngine = require("ejs-locals");
let controllers = require('./controllers');
let bodyParser = require('body-parser');
let flash = require('connect-flash');
let cookieParser = require('cookie-parser');
let expressSsession = require('express-session');

//Setup the View Engine
//app.set('view engine', 'jade');
//app.engine("ejs", ejsEngine);//support master page
//app.set('view engine', 'ejs');// ejs view engine
app.set('view engine', 'vash');// vash view engine

// Opt into Services
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSsession({
	secret: "TheSimpleApp_TheBoard",
	resave: false,
	saveUninitialized: false
}));
app.use(flash());

//set the public static resource folder
app.use(express.static(__dirname + "/public"));

// use authentication
let auth = require("./auth");
auth.init(app);

// Map the routes
controllers.init(app);

app.get("/api/users", (req, res) => {
	res.set("Content-Type", "application/json");
	res.send({name: "Ruslanchik", isValid: true, group: "Admin"});
});



let server = http.createServer(app);

server.listen(3000);

let updater = require('./updater');
updater.init(server);