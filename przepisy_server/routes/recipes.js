const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db, checkIfRecipeExists, deleteRecipeDataScore, deleteRecipeDataComments } = require('../DATABASE QUERIES/DB');

getTagsForRecipe = (req, res) => {
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT TAGS.text FROM Tags, Tags_connection WHERE Tags.id = tags_connection.id_tag AND tags_connection.id_recipe = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                var data = JSON.parse(JSON.stringify(results));
                rF.CorrectWData(res,
                {
                    data : data
                });
                return;
            }
        );
    }else{
        rF.Err(res, 500, "nie podano parametru id przepisu do tagów")
    }
    return;
};

getRecipes = (req, res) => {
    var type = req.query.type != undefined ? " type IN (" + req.query.type.split(",") + ")" : " TRUE = TRUE ";
    var spd = req.query.speed != undefined ? " speed IN (" + req.query.speed.split(",") + ")" : " TRUE = TRUE ";
    var lvl = req.query.lvl != undefined ? " lvl IN (" + req.query.lvl.split(",") + ")" : " TRUE = TRUE ";
    //var tag = req.query.tags != undefined ? " t IN (" + req.query.tags.split(",") + ")": "";
    
    console.log(`utworzone polecenia: \n typy: ${type} \n czas: ${spd} \n poziom: ${lvl} \n`)// tagi: ${tag}`)
    var q = `SELECT * FROM RECIPE WHERE ${type} AND ${spd} AND ${lvl}`;
    db.query(
        q, [], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }
            console.log(results);
            if (results.length > 0) {
                var data = JSON.parse(JSON.stringify(results));
                rF.CorrectWData(res,
                {
                    data: data,
                    error: 0,
                    errorMSG: ""
                });
            } else {
                rF.CorrectWData(res,
                {
                    data: "",
                    error: 1,
                    errorMSG: "Brak przepisów w bazie danych"
                });
            }		 	
            return;
        }
    );
};
/*
getRecipes = (req, res) => {
    var type = req.query.type != undefined ? req.query.type.split(",") : "";
    var spd = req.query.speed != undefined ? req.query.speed.split(",") : "";
    var lvl = req.query.lvl != undefined ? req.query.lvl.split(",") : "";
    var tag = req.query.tags != undefined ? req.query.tags.split(",") : "";
    console.log(type.length);
    console.log(`otrzymano \n typy: ${type} \n czas: ${spd} \n poziom: ${lvl} \n tagi: ${tag}`)
    db.query(
        'SELECT * FROM RECIPE', [], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }
            if (results.length > 0) {
                var data = JSON.parse(JSON.stringify(results));
                rF.CorrectWData(res,
                {
                    data: data,
                    error: 0,
                    errorMSG: ""
                });
            } else {
                rF.CorrectWData(res,
                {
                    data: "",
                    error: 1,
                    errorMSG: "Brak przepisów w bazie danych"
                });
            }		 	
            return;
        }
    );
};
*/
getRecipe = (req, res) => {
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT * FROM RECIPE WHERE ID = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.length == 1) {
                    var data = JSON.parse(JSON.stringify(results[0]));
                    var owner = data.id_user == req.userID;
                    var mod = req.userMOD || req.userADM;
                    rF.CorrectWData(res,
                    {
                        own : owner, 
                        mod : mod, 
                        name : data.name, 
                        text : data.text, 
                        type : data.type, 
                        speed : data.speed,
                        lvl : data.lvl,
                        tags : "nie zaimplementowano przesyłania tagów"
                    });
                    return;
                } else {
                    console.log(`Błąd wyszukiwania przepisu o id ${id} w bazie danych`);
                    if(results.length > 0)  console.log(`DUŻO PRZEPISÓW O ID ${id} W BAZIE DANYCH!`);
                    rF.DBError(res);
                }		 	
                return;
            }
        );
    }else{
        rF.Err(res, 500, "nie podano parametru id przepisu")
    }
    return;
};

postRecipe = (req, res) => {
	var _user = req.userID;
    var _name = req.body.name;
    var _text = req.body.text;
    var _type = req.body.type;
    var _tags = req.body.tags;
    var _speed = req.body.speed;
    var _lvl = req.body.lvl;

    console.log(_tags);

	if (_user && _name && _text && _type && _speed && _lvl) {
		db.query(
			'INSERT INTO RECIPE (ID_USER, NAME, TEXT, TYPE, SPEED, LVL) VALUES ( ?, ?, ?, ?, ?, ?);', 
			[_user, _name, _text, _type, _speed, _lvl], 
			function(error, results, fields) {
				if(error){
					console.log(error);
					rF.DBError(res);
					return;
				}

                if (results.affectedRows == 1) {
                    console.log(`dodano nowy przepis "${_name}" do bazy danych`);
                    var recipeID = results.insertId;
                    for(i in _tags)
                    {
                        var tag = _tags[i];
                        console.log(`tag: ${tag}`);
                        db.query(
                            'INSERT INTO tags (TEXT) VALUES ( ?);', 
                            [tag], 
                            function(error, results, fields) {
                                if(error){
                                    console.log(error);
                                    return;
                                }
                                var tagID = results.insertId;
                                db.query(
                                    'INSERT INTO tags_connection (id_tag, id_recipe) VALUES (?, ?);', 
                                    [tagID, recipeID], 
                                    function(error, results, fields) { 
                                        if(error){
                                            console.log(error);
                                            return;
                                        }
                                        console.log(`dodano tag ${tagID} do przepisu ${recipeID}`)  
                                        return;        
                                    }
                                );
                            }
                        );
                    }
                    rF.Correct(res);
                    
                }else{
                    console.log("SPRAWDZ BAZE DANYCH DODANO ZA DUZO PRZEPISÓW");
                    rF.DBError(res);
                }

                //TODO zwracanie id przepisu wstawionego i przejście do niego
				return;
			}
		);
	} else {
		rF.ReqError(res);
	}
};

deleteRecipe = (req, res) => {
    var id = req.query.id;
    if(id && req.userID && !req.userMOD && !req.userADM)
    {
        checkIfRecipeExists(id, req.userID)
        .then(
            () => deleteRecipeDataComments(id)
        ).then(
            () =>  deleteRecipeDataScore(id)
        ).then(
            () =>
            db.query(
                'DELETE FROM recipe WHERE ID = ?', [id], 
                function(error, results, fields) {
                    if(error){
                        console.log(error);
                        rF.DBError(res);
                        return;
                    }
                    if(results.affectedRows == 1)
                    {
                        rF.Correct(res);  
                    }else{
                        if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH USUNIĘTO ZA DUŻO KONT");
                        rF.DBError(res);
                    }
                    return;
                }
            )
        ).catch(err => {
            console.log(err);
            rF.ReqError(res);
          });
    }else{
        if(id && req.userMOD || req.userADM)
        {
            deleteRecipeDataComments(id)
            .then(
                () =>  deleteRecipeDataScore(id)
            ).then(
                () =>
                db.query(
                    'DELETE FROM recipe WHERE ID = ?', [id], 
                    function(error, results, fields) {
                        if(error){
                            console.log(error);
                            rF.DBError(res);
                            return;
                        }
                        if(results.affectedRows == 1)
                        {
                            rF.Correct(res);  
                        }else{
                            if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH USUNIĘTO ZA DUŻO KONT");
                            rF.DBError(res);
                        }
                        return;
                    }
                )
            ).catch(err => {
                console.log(err);
                rF.ReqError(res);
            });
        }else{
            rF.NoAuth(res);
        }
    }
    return;
};

updateRecipe = (req, res) => {
    var id = req.query.id;
    if(req.query.id && req.userID)
    {
        var name = req.body.name;
	    var text = req.body.text;
	    var type = req.body.type;
        var _tags = req.body.tags;
        var _speed = req.body.speed;
        var _lvl = req.body.lvl;

        if(name && text && type && _speed && _lvl)
        {
            if(req.userMOD || req.userADM)
            {
                db.query(
                    'UPDATE RECIPE SET name = ?,  text = ?, type = ?, speed = ?, lvl = ?  WHERE ID = ?', [name, text, type, _speed, _lvl, id], 
                    function(error, results, fields) {
                        if(error){
                            console.log(error);
                            rF.DBError(res);
                            return;
                        }
                        if (results.affectedRows == 1) {
                            console.log(`zaktualizowano przepis "${_name}" w bazie danych`);
                            db.query(
                                'DELETE FROM tags_connection WHERE id_recipe = ?;', 
                                [id], 
                                function(error, results, fields) {
                                    console.log(`dodawanie tagów: ${_tags}`);
                                    for(i in _tags)
                                    {
                                        var tag = _tags[i];
                                        console.log(`tag: ${tag}`);
                                        db.query(
                                            'INSERT INTO tags (TEXT) VALUES ( ?);', 
                                            [tag], 
                                            function(error, results, fields) {
                                                if(error){
                                                    console.log(error);
                                                    return;
                                                }
                                                var tagID = results.insertId;
                                                db.query(
                                                    'INSERT INTO tags_connection (id_tag, id_recipe) VALUES (?, ?);', 
                                                    [tagID, id], 
                                                    function(error, results, fields) { 
                                                        if(error){
                                                            console.log(error);
                                                            return;
                                                        }
                                                        console.log(`dodano tag ${tagID} do przepisu ${id}`)  
                                                        return;        
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            );
                            rF.Correct(res);
                        }else{
                            if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                            rF.DBError(res);
                        }
                        return;
                    }
                );
            }else{
                db.query(
                    'UPDATE RECIPE SET name = ?,  text = ?, type = ?, speed = ?, lvl = ?   WHERE ID = ? AND ID_USER = ?', [name, text, type, _speed, _lvl, id, req.userID], 
                    function(error, results, fields) {
                        if(error){
                            console.log(error);
                            rF.DBError(res);
                            return;
                        }
                        if (results.affectedRows == 1) {
                            console.log(`zaktualizowano przepis "${name}" w bazie danych`);
                            db.query(
                                'DELETE FROM tags_connection WHERE id_recipe = ?;', 
                                [id], 
                                function(error, results, fields) {
                                    console.log(`dodawanie tagów: ${_tags}`);
                                    for(i in _tags)
                                    {
                                        var tag = _tags[i];
                                        console.log(`tag: ${tag}`);
                                        db.query(
                                            'INSERT INTO tags (TEXT) VALUES ( ?);', 
                                            [tag], 
                                            function(error, results, fields) {
                                                if(error){
                                                    console.log(error);
                                                    return;
                                                }
                                                var tagID = results.insertId;
                                                db.query(
                                                    'INSERT INTO tags_connection (id_tag, id_recipe) VALUES (?, ?);', 
                                                    [tagID, id], 
                                                    function(error, results, fields) { 
                                                        if(error){
                                                            console.log(error);
                                                            return;
                                                        }
                                                        console.log(`dodano tag ${tagID} do przepisu ${id}`)  
                                                        return;        
                                                    }
                                                );
                                            }
                                        );
                                    }
                                }
                            );
                            rF.Correct(res);
                        }else{
                            if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                            rF.DBError(res);
                        }
                        return;
                    }
                );
            }
        }else{
            rF.ReqError(res);
        }
    }else{
        rF.NoAuth(res);
    }
    return;
};

const Recipes = {
    getRecipes : getRecipes,
    getRecipe : getRecipe,
    getTagsForRecipe : getTagsForRecipe,
    postRecipe : postRecipe,
    deleteRecipe : deleteRecipe,
    updateRecipe : updateRecipe
}

module.exports = Recipes;