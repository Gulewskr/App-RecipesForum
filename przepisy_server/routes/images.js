const config = require('../config/config');
const rF = require('../config/responses');
const { db } = require('../DATABASE QUERIES/DB');

addImage = (req, res) => {
	insertImageToDB(`/${req.file.path}`)
	.then((v) => {
		console.log(`dodano noowy obraz id: ${v}`)
		if(v != 0) res.status(200).send({url : `/${req.file.path}`, id : v});
		else res.sendStatus(500);
	})
}

insertImageToDB = async (imageURL) => {
	return new Promise(
		(resolve, reject) => {
		if(imageURL)
		{
			db.query(
            'INSERT INTO images (img_src) VALUES (?)', [imageURL],
			function(error, results, fields){
				if (error) {
					reject(error)
				}
				if(results.insertId != 0)
				{
					resolve( results.insertId );
				}else{
					reject("error");
				}
			});
		}else{
			reject("error");
		}}
	);
};

addConnectionToImage = async (imageID, recipeID) => {
	return new Promise(
		(resolve, reject) => {
		if(imageID && recipeID)
		{
			db.query(
            'INSERT INTO images_connection (id_image, id_recipe) VALUES (?, ?)', [imageID, recipeID],
			function(error, results, fields){
				if (error) {
					reject(error)
				}
				if(results.insertId != 0)
				{
					resolve( results.insertId );
				}else{
					reject("error");
				}
			});
		}else{
			reject("error");
		}}
	);
};

deleteImageFromDB = async (imageID) => {
	return new Promise(
		(resolve, reject) => {
		if(imageURL)
		{
			db.query(
            'DELETE FROM images WHERE id = ?', [imageID],
			function(error, results, fields){
				if (error) {
					reject(error)
				}
				if(results.affectedRows == 1)
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

setMainImageToRecipe = async (imgID, recID) => {
	return new Promise( (resolve, reject) => { 
		if(recID && imgID)
		{
			db.query(
			'UPDATE RECIPE SET id_mainimage = ?  WHERE ID = ?', [imgID, recID], 
			function(error, results, fields){
				if (error) {
					reject(error)
				}
				if(results.affectedRows == 1)
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

const ImagesFunctions = {
	addImage : addImage,
    insertImageToDB : insertImageToDB,
    addConnectionToImage : addConnectionToImage, 
    deleteImageFromDB : deleteImageFromDB,
	setMainImageToRecipe : setMainImageToRecipe
}

module.exports = ImagesFunctions;