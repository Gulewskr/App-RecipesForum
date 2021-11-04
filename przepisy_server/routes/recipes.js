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
    //TODO pobranie id z adresu do którego się odnosi
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id');
    console.log(id);
    /*
    db.query(
        'SELECT * FROM RECIPE WHERE ID_RECIPE = ?', [recipeID], 
        function(error, results, fields) {
            if(error){
                console.log(error);
                res.sendStatus(500);
                res.end();
                return;
            }
            if (results.length == 1) {
                var data = JSON.parse(JSON.stringify(results[0]));
                res.send({
                    data: data
                });
            } else {
                console.log(`Brak przepisu o id ${recipeID} w bazie danych`);
                res.sendStatus(204);
                res.send({
                    data: `Brak przepisu o id ${recipeID} w bazie danych`
                });
            }		 	
            res.end();
            return;
        }
    );*/
    res.sendStatus(500);
    res.end();
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
    res.status(403);
};

const Recipes = {
    getRecipes : getRecipes,
    getRecipe : getRecipe,
    postRecipe : postRecipe,
    deleteRecipe : deleteRecipe,
    updateRecipe : updateRecipe
}

module.exports = Recipes;