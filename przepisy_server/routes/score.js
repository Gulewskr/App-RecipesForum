const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const db = require('../DATABASE QUERIES/DB');
const e = require('express');

updateScore  = (req, res) => { 
    var userID = req.userID;
    var recipeID = req.body.recipe;
    var _score = req.body.score;

	if (userID && recipeID) {
		db.query(
            'SELECT * FROM score WHERE ID_recipe = ? AND id_user = ?;', 
            [recipeID, userID], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
    
                if (results.length == 1) {
                    if(_score){
                        updateteScoreDB(res, recipeID, userID, _score);
                    }else{
                        deleteScoreDB(res, recipeID, userID, _score);
                    }
                }else{
                    if(_score)
                        createScoreDB(res, recipeID, userID, _score);
                    else
		                rF.ReqError(res);
                }
                return;
            }
        );
	} else {
		rF.ReqError(res);
	}
};

createScoreDB = (res, recipeID, userID, score) => {
    db.query(
        'INSERT INTO score (ID_recipe, id_user, score) VALUES ( ?, ?, ?);', 
        [recipeID, userID, score], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }

            if (results.affectedRows == 1) {
                console.log(`dodano nową ocenę użytkownika ${userID} do przepisu "${recipeID}" do bazy danych`);
                rF.Correct(res);
            }else{
                console.log("SPRAWDZ BAZE DANYCH DODANO ZA DUZO PRZEPISÓW");
                rF.DBError(res);
            }
            return;
        }
    );
}

updateteScoreDB = (res, recipeID, userID, score) => {
    db.query(
        'UPDATE score SET score = ? WHERE ID_recipe = ? AND id_user = ?',
        [score, recipeID, userID], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }

            if (results.affectedRows == 1) {
                console.log(`zaaktualizowano ocenę użytkownika ${userID} przepisu "${recipeID}" w bazie danych`);
                rF.Correct(res);
            }else{
                console.log("SPRAWDZ BAZE DANYCH ZAKTUALIZOWANO ZA DUZO OCEN");
                rF.DBError(res);
            }
            return;
        }
    );
}

deleteScoreDB = (res, recipeID, userID, score) => {
    db.query(
        'DELETE FROM score WHERE ID_recipe = ? AND id_user = ?',
        [recipeID, userID], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }

            if (results.affectedRows == 1) {
                console.log(`usunięto ocenę użytkownika ${userID} przepisu "${recipeID}" w bazie danych`);
                rF.Correct(res);
            }else{
                console.log("SPRAWDZ BAZE DANYCH USUNIĘTO ZA DUZO OCEN");
                rF.DBError(res);
            }
            return;
        }
    );
}

getRecipeScore = (req, res) => { res.status(403); };

const Score = {
    updateScore : updateScore,
    getRecipeScore: getRecipeScore
}

module.exports = Score;