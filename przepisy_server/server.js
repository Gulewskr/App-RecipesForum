const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const config = require('./config/config');
const path = require('path');
const port = 3001

const jwt = require('jsonwebtoken');
const AuthF = require('./config/authorization');

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

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(function(request, response, next){
	// Website allowed to connect
	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // allowed request metod
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // allowed request headers
    response.setHeader('Access-Control-Allow-Headers', 'Access-token, content-type');
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
					console.log(error);
					response.sendStatus(500);
					response.end();
					return;
				}
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));
					
					//komentarz
					console.log("User: " + data.nick + " logged in.");

					var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
					
					//TODO (do późniejszej zmiany tylko liczbe przesyłam)
					var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";

					response.send({
						token: token,
						nick: data.nick,
						type: data.type, 

						lvl: accType,
						error: 0
					});
				} else {
					console.log("Błędne logowanie user: " + username  + " " + password);
					response.send({
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
			error: 2
		});
		response.end();
	}
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	var nick = request.body.nick;
	var email = request.body.email;
	/**
	 * username : _username,
              password : _password,
              nick: _nick,
              email: _email
	 */
	if (username && password && nick && email) {
		db.query(
			'INSERT INTO accounts (login, password, nick, email, type) VALUES ( ?, ?, ?, ?, 4);', 
			[username, password, nick, email], 
			function(error, results, fields) {
				if(error){
					console.log(error);
					response.sendStatus(500);
					response.end();
					return;
				}
				db.query(
					'SELECT * FROM ACCOUNTS WHERE LOGIN = ? AND PASSWORD = ?', 
					[username, password], 
					function(error, results, fields) {
						if(error){
							console.log(error);
							response.sendStatus(500);
							response.end();
							return;
						}
						if (results.length == 1) {
							var data = JSON.parse(JSON.stringify(results[0]));
							
							//komentarz
							console.log("User: " + data.nick + " logged in.");
		
							var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
							
							//TODO (do późniejszej zmiany tylko liczbe przesyłam)
							var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";
		
							response.send({
								token: token,
								nick: data.nick,
								type: data.type, 
		
								lvl: accType,
								error: 0
							});
						} else {
							console.log("Błędne logowanie user: " + username  + " " + password);
							response.send({
								error: 1
							});
						}		 	
						response.end();
						return;
					}
				);
				return;
			}
		);
	} else {
		console.log("Nie podano danych logowania");
		response.send({
			error: 2
		});
		response.end();
	}
});

app.post('/authByJWT', [AuthF.verifyToken], function(req, res) {
	if(req.userLvL && req.userId){
		db.query(
			'SELECT * FROM ACCOUNTS WHERE ID = ? AND TYPE = ?', 
			[req.userId, req.userLvL], 
			function(error, results, fields) {
				if(error){
					console.log(error);
					res.sendStatus(500);
					res.end();
					return;
				}
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));					
					console.log("User: " + data.nick + " is online again in.");

					//TODO
					var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";

					res.send({
						nick: data.nick,
						type: accType
					});
					res.end();
				} else {
					res.status(403).send();
				}		 	
			}
		);
	}else{
		res.status(403).send({
			message: "Server not prepared for POST"
		});
		res.end();
	}
});

app.post('/recipe', [AuthF.verifyToken], function(req, res) {});
//sprawdzanie czy uprawniony użytkownik
app.post('/profile', [AuthF.verifyToken], function(req, res) {});
//id przepisu i ewentualnie id komentarza do którego pisana jest odpowiedź
app.post('/recipe/comment', [AuthF.verifyToken], function(req, res) {});


//Moderatorzy i użytkownicy do których należy post
app.delete('/recipe/comment', [AuthF.verifyToken], function(req, res) {});
app.delete('/recipe', [AuthF.verifyToken], function(req, res) {});
app.delete('/profile', [AuthF.verifyToken], function(req, res) {});

app.put('/profile', [AuthF.verifyToken], function(req, res) {});
app.put('/recipe', [AuthF.verifyToken], function(req, res) {});
app.put('/recipe/comment', [AuthF.verifyToken], function(req, res) {});

app.get('/recipes', [AuthF.verifyToken], function(req, res) {});
app.get('/recipe', [AuthF.verifyToken], function(req, res) {});



app.listen(port, () => { console.log(`Server is working on port ${port}`)});