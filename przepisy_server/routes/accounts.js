const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/DB');

login = (request, response) => {
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
};

loginByJWT = (req, res) => {
	if(req.userTYPE && req.userID){
		db.query(
			'SELECT * FROM ACCOUNTS WHERE ID = ? AND TYPE = ?', 
			[req.userID, req.userTYPE], 
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
						id:	req.userID,
						nick: data.nick,
						type: accType,
						error: 0
					});
					res.end();
				} else {
					console.log("Znaleziono wiele użytkowników");
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
};

register = (request, response) => {
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
};

const Accounts = {
    login : login,
    loginByJWT : loginByJWT,
    register : register
};

module.exports = Accounts;