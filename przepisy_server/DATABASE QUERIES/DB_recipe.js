const { db } = require('./DB');
const { deleteRecipeConnection, deleteImage } = require('./DB_recipe_images');

module.exports.deleteRecipeDataScore = async (id) => {
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

module.exports.deleteRecipeDataComments = async (id) => {
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

module.exports.deleteRecipeDataImages = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'SELECT * FROM images_connection WHERE ID_RECIPE = ?', [id],
			function(error, results, fields){
				if (error) {
					reject(error)
				} else {
					deleteRecipeConnection(id)
					.then(() => {
						for(let i = 0; i < results.length; i++)
						{
							deleteImage(results[i].id_image);
						}
						resolve(results);
					})
				}
			});
		}else{
			reject("error");
		}}
	);
};

module.exports.checkIfRecipeExists = async (id_recipe, id_user) => {
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

