const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db } = require('../DATABASE QUERIES/DB');

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
        db.query(
            'SELECT c.id AS id, c.text as text, c.id_user as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl FROM comments c LEFT JOIN accounts u ON c.id_user = u.id LEFT JOIN images ia ON u.id_profile_image = ia.id WHERE c.id_recipe = ?', 
            [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.length > 0) {
                    let data = [];
                    for(let i = 0; i < results.length; i++)
                    {
                        data.push(
                            {
                                id: results[i].id,
                                text: results[i].text,
                                id_recipe: id,
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
        rF.ReqError(res);
    }
    return;
}

const Profile = {
    createComment : createComment,
    deleteComment : deleteComment, 
    updateComment : updateComment,
    getComments : getComments
}

module.exports = Profile;