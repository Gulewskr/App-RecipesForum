const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db, dbF } = require('../DATABASE QUERIES/DB');

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
					rF.DBError(res);
					return;
				}
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));
					
					//komentarz
					console.log("User: " + data.nick + " logged in.");

					var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
					
					//TODO (do późniejszej zmiany tylko liczbe przesyłam)
					var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";

					rF.CorrectWData(response,
					{
						token: token,
						error: 0
					});
				} else {
					rF.Err(response, 400, "Błędne logowanie user: " + username  + " " + password);
				}		 	
				return;
			}
		);
	} else {
		rF.Err(response, 400, "Nie podano danych logowania");
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
					rF.DBError(res);
					return;
				}
				if (results.length == 1) {
					var data = JSON.parse(JSON.stringify(results[0]));					
					console.log("User: " + data.nick + " is online again in.");

					//TODO
					var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";

					rF.CorrectWData(res,
					{
						id:	req.userID,
						nick: data.nick,
						type: accType,
						error: 0
					});
				} else {
					console.log("Znaleziono wiele użytkowników");
					rF.DBError(res);
				}		 	
			}
		);
	}else{
		rF.ReqError(res);
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
					rF.DBError(response);
					return;
				}
				db.query(
					'SELECT * FROM ACCOUNTS WHERE LOGIN = ? AND PASSWORD = ?', 
					[username, password], 
					function(error, results, fields) {
						if(error){
							console.log(error);
							rF.DBError(response);
							return;
						}
						if (results.length == 1) {
							var data = JSON.parse(JSON.stringify(results[0]));
							
							//komentarz
							console.log("User: " + data.nick + " logged in.");
		
							var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
							
							//TODO (do późniejszej zmiany tylko liczbe przesyłam)
							var accType = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";
		
							rF.CorrectWData(response,
							{
								token: token,
								error: 0
							});
						} else {
							rF.Err(response, 400, "Błędne logowanie user: " + username  + " " + password);
						}		 	
						return;
					}
				);
				return;
			}
		);
	} else {
		rF.Err(response, 500, "Nie podano danych logowania");
	}
};

const Accounts = {
    login : login,
    loginByJWT : loginByJWT,
    register : register
};

module.exports = Accounts;