const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/DB');

getRecipes = (req, res) => {
    db.query(
        'SELECT * FROM RECIPE', [], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                res.sendStatus(500);
                res.end();
                return;
            }
            if (results.length > 0) {
                var data = JSON.parse(JSON.stringify(results));
                res.send({
                    data: data
                });
            } else {
                console.log("Brak przepisów w bazie danych");
                res.send({
                    data: "Brak przepisów w bazie danych"
                });
            }		 	
            res.end();
            return;
        }
    );
};

getRecipe = (req, res) => {
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT * FROM RECIPE WHERE ID = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    res.status(500).send({
                        error : 1,
                        errorMSG : "wystąpił błąd bazy danych"
                    });
                    res.end();
                    return;
                }
                if (results.length == 1) {
                    var data = JSON.parse(JSON.stringify(results[0]));
                    var owner = data.id_user == req.userID;
                    var mod = req.userMOD || req.userADM;
                    res.status(200).send({
                        own : owner, 
                        mod : mod, 
                        name : data.name, 
                        text : data.text, 
                        type : data.type, 
                        tags : "nie zaimplementowano przesyłania tagów"
                    });
                    res.end();
                    return;
                } else {
                    console.log(`Błąd wyszukiwania przepisu o id ${id} w bazie danych`);
                    res.status(500).send({
                        error : 1,
                        errorMSG : "wystąpił błąd bazy danych"
                    });
                    res.end();
                }		 	
                return;
            }
        );
    }else{
        res.status(500).send({
            error : 1,
            errorMSG : "nie podano parametru id przepisu"
        });
        res.end();
    }
    return;
};

postRecipe = (req, res) => {
	var _user = req.userID;
    var _name = req.body.name;
    var _text = req.body.text;
    var _type = req.body.type;
    var _tags = req.body.tags;

	if (_user && _name && _text && _type) {
		db.query(
			'INSERT INTO RECIPE (ID_USER, NAME, TEXT, TYPE) VALUES ( ?, ?, ?, ?);', 
			[_user, _name, _text, _type], 
			function(error, results, fields) {
				if(error){
					console.log(error);
					res.sendStatus(500);
					res.end();
					return;
				}
                console.log(`dodano nowy przepis "${_name}" do bazy danych`);
                //TODO zwracanie id przepisu wstawionego
                res.status(200).send({
                    data: 1
                });
				res.end();
				return;
			}
		);
	} else {
		console.log("Nie podano danych nowego przepisu");
		res.send({
			error: 2
		});
		res.end();
	}
};

deleteRecipe = (req, res) => {
    res.status(403);
};

updateRecipe = (req, res) => {
    var id = req.query.id;
    if(req.query.id && req.userID)
    {
        var name = req.body.name;
	    var text = req.body.text;
	    var type = req.body.type;
        if(name && text && type)
        {
            if(req.userMOD || req.userADM)
            {
                db.query(
                    'UPDATE RECIPE SET name = ?,  text = ?, type = ?  WHERE ID = ?', [name, text, type, id], 
                    function(error, results, fields) {
                        if(error){
                            console.log(error);
                            res.status(500).send({
                                error : 1,
                                errorMSG : "wystąpił błąd bazy danych"
                            });
                            res.end();
                            return;
                        }
                        if(results.affectedRows == 1)
                        {
                            res.sendStatus(200);
                            res.end();    
                        }else{
                            if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                            res.status(500).send({
                                error : 1,
                                errorMSG : "wystąpił błąd bazy danych"
                            });
                            res.end();
                        }
                        return;
                    }
                );
            }else{
                db.query(
                    'UPDATE RECIPE SET name = ?,  text = ?, type = ?  WHERE ID = ? AND ID_USER = ?', [name, text, type, id, req.userID], 
                    function(error, results, fields) {
                        if(error){
                            console.log(error);
                            res.status(500).send({
                                error : 1,
                                errorMSG : "wystąpił błąd bazy danych"
                            });
                            res.end();
                            return;
                        }
                        if(results.affectedRows == 1)
                        {
                            res.sendStatus(200);
                            res.end();    
                        }else{
                            if(results.affectedRows > 1)
                            {
                                console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                                res.status(500).send({
                                    error : 1,
                                    errorMSG : "wystąpił błąd bazy danych"
                                });
                            }else{
                                res.status(400).send({
                                    error : 1,
                                    errorMSG : "Nie posiadasz uprawnień do tej operacji"
                                });
                            }
                            res.end();
                        }
                        return;
                    }
                );
            }
        }else{
            res.status(403).send({
                error : 1,
                errorMSG : "Błędne żądanie"
            });
            res.end();
        }
    }else{
        res.status(403).send({
            error : 1,
            errorMSG : "Nie posiadasz uprawnień do przeprowadzenia tej operacji"
        });
        res.end();
    }
    return;
};

const Recipes = {
    getRecipes : getRecipes,
    getRecipe : getRecipe,
    postRecipe : postRecipe,
    deleteRecipe : deleteRecipe,
    updateRecipe : updateRecipe
}

module.exports = Recipes;