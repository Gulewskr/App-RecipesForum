const { db} = require('./DB');


module.exports.updateRecipeImages = async (idRecipe, idImageTable) => {
    return new Promise(
		(resolve, reject) => {
		if(idRecipe && Array.isArray(idImageTable))
        {
            deleteRecipeDataImages(idRecipe)
			.then(() => {
				if(idImageTable.length > 0)
				{
					updateRecipeMainDataImages(idRecipe, idImageTable[0])
					.then(() => {
						addImagesToRecipe(idRecipe, idImageTable.slice(1))
					})
					.then(() => {
						console.log(`\u001B[32mINFO: recipe images updated ${idRecipe} \u001B[0m`)
					})
					.catch((err) => {
						console.log("\u001B[31mWARN: error accused - recipe images update\u001B[0m");
					})
				}else{
					updateRecipeMainDataImages(idRecipe, null)
					.then(() => {
						console.log(`\u001B[32mINFO: recipe images updated ${idRecipe} \u001B[0m`)
					})
					.catch((err) => {
						console.log("\u001B[31mWARN: error accused - recipe images update\u001B[0m");
					})
				}
				resolve();
			})
			.catch((err) => {
				console.log("\u001B[31mWARN: error accused - recipe images delete\u001B[0m");
			})
        }else{
			reject("error");
        };
    }
	);
}

deleteRecipeDataImages = async (id) => {
	return new Promise(
		(resolve, reject) => {
		if(id)
		{db.query(
            'DELETE FROM images_connection WHERE ID_RECIPE = ?', [id],
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

updateRecipeMainDataImages = async (idRecipe, idImage) => {
	return new Promise(
		(resolve, reject) => {
		if(idRecipe)
		{db.query(
            'UPDATE RECIPE SET id_mainimage = ? WHERE id = ?', [idImage, idRecipe],
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

addImagesToRecipe = async (idRecipe, idsImages) => {
    return new Promise(
		(resolve, reject) => {
		if(idRecipe && Array.isArray(idsImages))
		{
            idsImages.forEach((v,i) => {
                addImageToRecipe(idRecipe, v);
            });
			resolve();
		}else{
			reject("error");
		}}
	);
};

addImageToRecipe = async (idRecipe, idImage) => {
    return new Promise(
		(resolve, reject) => {
		if(idRecipe && idImage)
		{
            db.query(
            'INSERT INTO images_connection (ID_RECIPE, ID_IMAGE) VALUES (?, ?)', [idRecipe, idImage],
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