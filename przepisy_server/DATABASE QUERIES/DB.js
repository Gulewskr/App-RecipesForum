const mysql = require('mysql');

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

deleteNotUsingTags = () => {
	db.query(
		'DELETE FROM tags  WHERE NOT EXISTS (SELECT * FROM tags_connection WHERE id_tag = tags.id)', [],
		function(error, results, fields){
			if (error) {
				console.log(error);
			} else {
				console.log("zaktualizowano dane");
			}
		});
}

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

deleteRecipeDataScore = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{
			db.query(
            'DELETE FROM SCORE WHERE ID_RECIPE = ?', [id], 
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

deleteRecipeDataComments = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM comments WHERE ID_RECIPE = ?', [id],
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

checkIfRecipeExists = async (id_recipe, id_user) => {
	return new Promise(
		(resolve, reject) => {
		if(id_recipe && id_user)
		{
			db.query(
            'SELECT * FROM recipe WHERE id = ? AND id_user = ?', [id_recipe, id_user],
			function(error, results, fields){
				if (error) {
					reject(error)
				}
				if(results.length == 1)
				{
					resolve(results);
				}else{
					reject("error");
				}
			});
		}else{
			reject("error");
		}}
	);
};


module.exports = {db, checkIfRecipeExists, deleteUserDataRecipes, deleteNotUsingTags, deleteUserDataScoreForRecipe, 
	deleteUserDataScore, deleteUserDataComments, deleteUserDataCommentsForRecipe, 
	deleteRecipeDataScore, deleteRecipeDataComments};