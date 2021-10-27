const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/config');
const path = require('path');
const port = 3001

const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'AdminPrzepisy',
	password : 'password123',
	database : 'db_przepisy'
});

db.connect((error) => {
	if(error) throw error;
	console.log("connected");
})

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function(request, response, next){
	// Website allowed to connect
	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // allowed request metod
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // allowed request headers
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    // allow cookies in requests
    response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


/*
	Logowanie:
	błędy :
		0 - brak
		1 - błędny login/hasło
		2 - błąd serwera
*/
app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		db.query(
			'SELECT * FROM ACCOUNTS WHERE LOGIN = ? AND PASSWORD = ?', 
			[username, password], 
			function(error, results, fields) {
				if(error){
					//response.send("Error Occured.");
					console.log(error);
					response.sendStatus(500);
					response.end();
					return;
				}
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));
					request.session.logged = true;
					request.session.token = 
					request.session.username = data.nick;
					request.session.email = data.email;
					request.session.type = data.type;
					console.log("User: " + data.nick + " logged in.");

					var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
					response.cookie('token', token, { httpOnly: true });
					response.send({
						token: token,
						error: 0
					});
				} else {
					console.log("Błędne logowanie user: " + username  + " " + password);
					response.send({
						token: null,
						error: 1
					});
				}		 	
				response.end();
				return;
			}
		);
	} else {
		console.log("Nie podano danych logowania");
		response.send({
			token: null,
			error: 2
		});
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.logged) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(port, () => { console.log(`Server is working on port ${port}`)});