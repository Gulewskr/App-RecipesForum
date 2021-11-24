const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db } = require('../DATABASE QUERIES/DB');

login = (request, response) => {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		loginByLoginAndPassword(response, username, password);
	} else {
		rF.Err(response, 400, "Nie podano danych logowania");
	}
};

loginByLoginAndPassword = (res, username, password) => {
	db.query(
		'SELECT * FROM ACCOUNTS WHERE LOGIN = ? AND PASSWORD IN (SELECT SHA2(?, 256))', 
		[username, password], 
		function(error, results, fields) {
			if(error){
				console.log(error);
				rF.DBError(res);
				return;
			}
			if (results.length == 1) {
				var data = JSON.parse(JSON.stringify(results[0]));
				
				console.log(`\u001B[33mGenerating token for user: ${data.id} - ${data.nick}\u001B[0m`);
				var token = jwt.sign({id: data.id, lvl: data.type }, config.jwtKey);
				
				rF.CorrectWData(res,
				{
					token: token,
					error: 0
				});
			} else {
				rF.Err(res, 400, "Błędne logowanie user: " + username  + " " + password);
			}		 	
			return;
		}
	);
}

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
					rF.CorrectWData(res,
					{
						id:	req.userID,
						nick: data.nick,
						type: data.type,
						error: 0
					});
				} else {
					if(results.length > 1) console.log("Znaleziono wiele użytkowników");
					else console.log("nie znaleziono użytkownika");
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

	if (username && password && nick && email) {
		db.query(
			'INSERT INTO accounts (login, password, nick, email, type) SELECT  ?, SHA2(?, 256), ?, ?, 4;', 
			[username, password, nick, email], 
			function(error, results, fields) {
				if(error){
					console.log(error);
					rF.DBError(response);
					return;
				}
				loginByLoginAndPassword(response, username, password);
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