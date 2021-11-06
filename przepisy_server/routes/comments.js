const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const db = require('../DATABASE QUERIES/DB');

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

deleteComment  = (req, res) => { rF.ReqError(res); };
updateComment  = (req, res) => { rF.ReqError(res); };

getComments = (req, res) => { rF.ReqError(res); };

const Profile = {
    createComment : createComment,
    deleteComment : deleteComment, 
    updateComment : updateComment,
    getComments : getComments
}

module.exports = Profile;