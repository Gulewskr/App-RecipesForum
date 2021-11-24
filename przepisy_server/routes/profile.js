const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const { db } = require('../DATABASE QUERIES/DB');
const { updateUserImage, deleteUserDataScore, deleteUserDataScoreForRecipe, deleteUserDataRecipes, deleteUserDataComments, deleteUserDataCommentsForRecipe } = require('../DATABASE QUERIES/DB_accounts');

//Chyba nie potrzebny endpoint
//createAccount  = (req, res) => { res.status(403); };
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
        var img = req.body.image;
        if(img) updateUserImage(img, id); 
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
            'SELECT accounts.*, images.img_src FROM accounts LEFT JOIN images ON images.id = accounts.id_profile_image WHERE accounts.ID = ?', [id], 
            function(error, results, fields) {
                if(error){
                    console.log(error);
                    rF.DBError(res);
                    return;
                }
                if (results.length == 1) {
                    var data = JSON.parse(JSON.stringify(results[0]));
                    var owner = req.userID == id;
                    var mod = req.userMOD || req.userADM;
                    rF.CorrectWData(res,
                    {
                        own : owner,
                        mod : mod,
                        name : data.nick,
                        email : data.email,
                        type : data.type,
                        error : 0,
                        image : {
                            id : data.id_profile_image,
                            src: data.img_src
                        },
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
    deleteAccount : deleteAccount, 
    updateAccount : updateAccount,
    updateAccountPasswd : updateAccountPasswd,
    getAccountProfile : getAccountProfile
}

module.exports = Profile;