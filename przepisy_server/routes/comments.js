const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db, dbF } = require('../DATABASE QUERIES/DB');

createComment  = (req, res) => { 
    var rec = req.body.recipeID;
    var usr = req.userID;
    var cID = req.body.commentID;
    var com = req.body.commentTEXT;
    if(rec && usr && cID && com)
    {
        db.query(
            'INSERT INTO comments (id_recipe, id_user, text) VALUES ( ?, ?, ?);', 
            [rec, usr, com], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.affectedRows == 1) {
                    console.log(`Dodano komentarz ${com}`);
                    rF.Correct(res);
                }else{
                    console.log("SPRAWDZ BAZE DANYCH DODANO ZA DUZO KOMENTARZY");
                    rF.DBError(res);
                }
                return;
            }
        );
        //if(cID == -1){}else{}
    }else{
        rF.ReqError(res);
    }
};

deleteComment  = (req, res) => {
    var id = req.query.id;
    if(id && req.userID && !req.userMOD && !req.userADM)
    {
        db.query(
            'DELETE FROM comments WHERE ID = ? AND id_user = ? ', [id, req.userID], 
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
                    if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH USUNIĘTO ZA DUŻO komentarzy");
                    rF.DBError(res);
                }
                return;
            }
        );
    }else{
        if(id && req.userMOD || req.userADM)
        {
            db.query(
                'DELETE FROM comments WHERE ID = ?', [id], 
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
                        if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH USUNIĘTO ZA DUŻO komentarzy");
                        rF.DBError(res);
                    }
                    return;
                }
            );
        }else{
            rF.NoAuth(res);
        }
    }
    return;
};
updateComment  = (req, res) => { rF.ReqError(res); };

getComments = (req, res) => { 
    if(req.query.id)
    {
        var id = req.query.id;
        if(req.userID)
        {
            var id_user = req.userID;
            var mod = (req.userADM || req.userMOD);
            db.query(
                'SELECT comments.id, id_recipe, id_user, comments.text, id_user = ? as \'owner\', ? as \'mod\' FROM comments, accounts WHERE id_recipe = ? AND id_user = accounts.id', 
                [id_user, mod, id], 
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
                                data : data,
                                error : ""
                            });
                        return;
                    } else {
                        console.log(`Brak komenatarzy do przepisu o id ${id} w bazie danych`);
                        rF.CorrectWData(res,
                        {
                            data : "",
                            error : "Brak komentarzy"
                        });
                    }		 	
                    return;
                }
            );
        }else{
            db.query(
                'SELECT comments.id, id_recipe, id_user, comments.text, false as \'owner\', false as \'mod\' FROM comments, accounts WHERE id_recipe = ? AND id_user = accounts.id', 
                [id], 
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
                                data : data,
                                error : ""
                            });
                        return;
                    } else {
                        console.log(`Brak komenatarzy do przepisu o id ${id} w bazie danych`);
                        rF.CorrectWData(res,
                        {
                            data : "",
                            error : "Brak komentarzy"
                        });
                    }		 	
                    return;
                }
            );
        }
    }else{
        rF.ReqError(res); 
    }
};

const Profile = {
    createComment : createComment,
    deleteComment : deleteComment, 
    updateComment : updateComment,
    getComments : getComments
}

module.exports = Profile;