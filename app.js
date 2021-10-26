var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var db = mysql.createConnection({
	host     : 'localhost',
	user     : 'AdminPrzepisy',
	password : 'password123',
	database : 'db_przepisy'
});

db.connect((error) => {
	if(error) throw error;
	console.log("connected");
})

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		db.query(
			'SELECT * FROM ACCOUNTS WHERE LOGIN = ? AND PASSWORD = ?', 
			[username, password], 
			function(error, results, fields) {
				if(error) throw error;
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));
					request.session.logged = true;
					request.session.username = data.nick;
					request.session.email = data.email;
					request.session.type = data.type;
					response.redirect('/home');
				} else {
					response.send('Incorrect Username and/or Password!');
				}			
				response.end();
			}
		);
	} else {
		response.send('Please enter Username and Password!');
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

app.listen(3000);