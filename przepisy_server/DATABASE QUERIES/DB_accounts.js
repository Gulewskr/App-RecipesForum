const { db } = require('./DB');

module.exports.updateUserImage = async (imageID, userID) => {
	return new Promise(
		(resolve, reject) => {
        console.log(`${tag} -> ???`);
        if(tag)
		{
            db.query(
                'UPDATE ACCOUNTS SET id_profile_image = ? WHERE ID = ?', [imageID, userID],
			function(error, results, fields){
				if (error) {
					reject(error)
				} 
                if(results.affectedRows == 1)
                {
                    console.log("\u001B[32mINFO: Changed profile image for user ${userID} \u001B[0m");
                    resolve();   
                }
                if(results.affectedRows > 1) console.log("\u001B[31mWARN: Modified ${results.affectedRows} rows when updating profile image \u001B[0m");
                reject(error);
            });
		}else{
			reject("error");
		}}
	);
};


module.exports.deleteUserDataComments = async (id) => {
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

module.exports.deleteUserDataCommentsForRecipe = async (id) => {
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

module.exports.deleteUserDataScore = async (id) => {
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

module.exports.deleteUserDataScoreForRecipe = async (id) => {
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

module.exports.deleteUserDataRecipes = async (id) => {
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