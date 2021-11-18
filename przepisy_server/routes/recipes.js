const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const iF = require('../routes/images');
const { db, checkIfRecipeExists, deleteRecipeDataScore, deleteRecipeDataComments, deleteNotUsingTags } = require('../DATABASE QUERIES/DB');

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

getImagesForRecipe = (req, res) => {
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT i.id as id_, i.img_src as imageURL FROM images i, images_connection ic WHERE i.id = ic.id_image AND ic.id_recipe = ?', [id], 
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
    var type = req.query.type != undefined ? " r.type IN (" + req.query.type.split(",") + ")" : " TRUE ";
    var spd = req.query.speed != undefined ? " r.speed IN (" + req.query.speed.split(",") + ")" : " TRUE ";
    var lvl = req.query.lvl != undefined ? " r.lvl IN (" + req.query.lvl.split(",") + ")" : " TRUE ";
    var premium = req.query.premium != undefined ? " r.id_user in ( SELECT id FROM accounts a WHERE a.type = 1 OR a.type = 2 OR a.type = 3 ) " : " TRUE ";
    var tag = req.query.tags != undefined ? "r.id in (SELECT tags_connection.id_recipe FROM tags, tags_connection WHERE tags.TEXT in (\"" + req.query.tags.split(",").join("\", \"") + "\") AND tags.id = tags_connection.id_tag )": "true";

    var q = `SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE ${type} AND ${spd} AND ${lvl} AND ${tag} AND ${premium}`
    db.query(
        q, [], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                rF.DBError(res);
                return;
            }
            //console.log(results);
            if (results.length > 0) {
                let data = [];
                for(let i = 0; i < results.length; i++)
                {
                    data.push(
                        {
                            id: results[i].id,
                            name: results[i].name,
                            text: results[i].text,
                            type: results[i].type,
                            speed: results[i].speed,
                            lvl: results[i].lvl,
                            imageURL: results[i].imageUrl,
                            user:
                            {
                                id_: results[i].user_id,
                                name: results[i].user_name,
                                type: results[i].user_type,
                                imageURL: results[i].user_imageUrl
                            }
                        }
                    );
                }
                rF.CorrectWData(res, 
                    {
                        data :  data,
                        error : 0,
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

getTags = (req, res) => {
    db.query(
        'SELECT * FROM TAGS', [], 
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
                    errorMSG: "Brak tagów w bazie danych"
                });
            }		 	
            return;
        }
    );
};


getRecipe = (req, res) => {
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT r.id AS id, r.name as name, r.text as text, r.type as type, r.speed as speed, r.lvl as lvl, r.id_mainimage as imageId, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE r.id = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.length == 1) {
                    console.log(results[0]);
                    var data = JSON.parse(JSON.stringify(results[0]));
                    var owner = data.id_user == req.userID;
                    var mod = req.userMOD || req.userADM;
                    rF.CorrectWData(res,
                    {
                        id: results[0].id,
                        name : results[0].name, 
                        text : results[0].text, 
                        type : results[0].type, 
                        speed : results[0].speed,
                        lvl : results[0].lvl,
                        image : {
                            imageURL : results[0].imageUrl,
                            id_ : results[0].imageId
                        },
                        user: {
                            id_ : results[0].user_id,
                            name : results[0].user_name,
                            type : results[0].user_type,
                            imageURL : results[0].user_imageUrl
                        },
                        own : owner, 
                        mod : mod
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
    var _images = req.body.images;

    console.log(_images);
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
                            'INSERT INTO tags (TEXT) VALUES ( ? ) ON DUPLICATE KEY UPDATE TEXT = ?;', 
                            [tag, tag], 
                            function(error, results, fields) {
                                if(error){
                                    console.log(error);
                                    return;
                                }
                                var tagID = results.insertId;
                                if(tagID != 0){
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
                                }else{
                                    db.query(
                                        'SELECT * FROM tags WHERE TEXT = ?;', 
                                        [tag, tag],
                                        function(error, results, fields) {
                                            if(error){
                                                console.log(error);
                                                return;
                                            }
                                            var tagID = JSON.parse(JSON.stringify(results[0])).id;
                                            if(tagID)
                                            {
                                                console.log(tagID);
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
                                        }
                                    );
                                }
                            }
                        );
                    }
                    if(_images != undefined && _images.length > 0)
                    {
                        iF.setMainImageToRecipe(_images[0], recipeID)
                        .then(() => {
                            for(let i = 1; i < _images.length; i++)
                            {
                                iF.addConnectionToImage( _images[i], recipeID);
                            }
                        })
                        .catch(err => console.log(err))
                    }
                    rF.CorrectWData(res, {
                        id: recipeID, 
                        error: 0,
                        errorMSG: ""
                    });
                }else{
                    console.log("SPRAWDZ BAZE DANYCH DODANO ZA DUZO PRZEPISÓW");
                    rF.DBError(res);
                }
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
    deleteNotUsingTags();
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
                            deleteNotUsingTags();
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
                            deleteNotUsingTags();
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
    getImagesForRecipe : getImagesForRecipe,
    getTags : getTags,
    postRecipe : postRecipe,
    deleteRecipe : deleteRecipe,
    updateRecipe : updateRecipe
}

module.exports = Recipes;