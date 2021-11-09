const mysql = require('mysql');
var async = require("async");

const db = mysql.createConnection({
	host     : 'localhost',
	user     : 'AdminPrzepisy',
	password : 'password123',
	database : 'db_przepisy'
});

db.connect((error) => {
	if(error) throw error;
	console.log("connected");
});

deleteUserDataComments = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM comments WHERE ID_USER = ?', [id],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

deleteUserDataCommentsForRecipe = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM comments WHERE ID_RECIPE IN (SELECT id FROM recipe WHERE ID_USER = ?)', [id],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

deleteUserDataScore = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{
			db.query(
            'DELETE FROM SCORE WHERE ID_USER = ?', [id], 
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

deleteUserDataScoreForRecipe = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{
			db.query(
            'DELETE FROM score WHERE ID_RECIPE IN (SELECT id FROM recipe WHERE ID_USER = ?)', [id], 
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

deleteUserDataRecipes = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM recipe WHERE ID_USER = ?', [id],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					resolve(results);
				}
			});
		}else{
			reject("error");
		}}
	);
};

module.exports = {db, deleteUserDataRecipes, deleteUserDataScoreForRecipe, deleteUserDataScore, deleteUserDataComments, deleteUserDataCommentsForRecipe};