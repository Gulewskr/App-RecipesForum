const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db, deleteUserDataScore, deleteUserDataScoreForRecipe, deleteUserDataRecipes, deleteUserDataComments, deleteUserDataCommentsForRecipe  } = require('../DATABASE QUERIES/DB');

createAccount  = (req, res) => { res.status(403); };
deleteAccount  = (req, res) => {
    var id = req.query.id;
    if(id && req.userID && (id == req.userID || req.userMOD || req.userADM))
    {
        deleteUserDataScoreForRecipe(id)
        .then(
            () =>  deleteUserDataCommentsForRecipe(id)
        ).then(
            () => deleteUserDataRecipes(id)
        ).then(
            () => deleteUserDataComments(id)
        ).then(
            () => deleteUserDataScore(id)
        ).then(
            () =>
            db.query(
                'DELETE FROM ACCOUNTS WHERE ID = ?', [id], 
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
          });
    }else{
        rF.NoAuth(res);
    }
    return;
};
updateAccountPasswd  = (req, res) => { 
    var id = req.query.id;
    if(req.query.id && req.userID && id == req.userID)
    {
        var passwdOld = req.body.passwdOld;
        var passwdNew = req.body.passwdNew;
        if(passwdOld && passwdNew){
            db.query(
                'UPDATE ACCOUNTS SET password = ?  WHERE ID = ? AND password = ?', [passwdNew, id, passwdOld], 
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
                        if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                        rF.DBError(res);
                    }
                    return;
                }
            );
        }else{
            rF.ReqError(res);
        }
    }else{
        rF.NoAuth(res);
    }
    return;
};
updateAccount  = (req, res) => { 
    var id = req.query.id;
    if(req.query.id && req.userID && (id == req.userID || req.userMOD || req.userADM))
    {
        var nick = req.body.nick;
	    var email = req.body.email;
        if(nick && email){
            db.query(
                'UPDATE ACCOUNTS SET nick = ?,  email = ?  WHERE ID = ?', [nick, email, id], 
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
                        if(results.affectedRows > 1) console.log("SPRAWDZ BAZE DANYCH ERROR HASŁA ZMIANA");
                        rF.DBError(res);
                    }
                    return;
                }
            );
        }else{
            rF.ReqError(res);
        }
    }else{
        rF.NoAuth(res);
    }
    return;
};
getAccountProfile = (req,res) => 
{
    if(req.query.id)
    {
        var id = req.query.id;
        db.query(
            'SELECT * FROM ACCOUNTS WHERE ID = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.length == 1) {
                    var data = JSON.parse(JSON.stringify(results[0]));
                    /*
                    own === true : false;
                    nick = data !== "" ? data.name : "null";
                    email = data !== "" ? data.email : "null";
                    type = data !== "" ? data.type : "null";
                    recipeNum = data !== "" ? data.rn : 0;
                    commentNum = data !== "" ? data.cn : 0;
                    avgScore = data !== "" ? data.scr : 0;
                     */
                    var owner = req.userID == id;
                    var mod = req.userMOD || req.userADM;
                    var type = (data.type > 1) ? (data.type > 2) ? (data.type === 3) ? "premium" : "normal" : "moderator" : "administrator";
                    rF.CorrectWData(res,
                    {
                        own : owner,
                        mod : mod,
                        name : data.nick,
                        email : data.email,
                        type : type,
                        error : 0,
                        errorMSG : ""
                    });
                    res.end();
                    return;
                } else {
                    console.log(`Błąd wyszukiwania użytkownika o id ${id} w bazie danych`);
                    if(results.length > 1)  console.log(`DUŻO UŻOTKOWNIKÓW O ID ${id} W BAZIE DANYCH!`);
                    rF.DBError(res);
                }		 	
                return;
            }
        );
    }else{
        rF.Err(res, 500, "nie podano parametru id użytkownika")
    }
    return;
};

const Profile = {
    createAccount : createAccount,
    deleteAccount : deleteAccount, 
    updateAccount : updateAccount,
    updateAccountPasswd : updateAccountPasswd,
    getAccountProfile : getAccountProfile
}

module.exports = Profile;