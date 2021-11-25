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
updateAccountImage = (req, res) => { 
    var id = req.query.id;
    if(req.query.id && req.userID && id == req.userID || req.userMOD || req.userADM)
    {
        var image = req.body.image;
        if(image){
            updateUserImage(image, id)
            .then(() => rF.Correct(res))
            .catch(e => rF.DBError(res))
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
        let id = req.query.id;
        let q = `SELECT a.*, i.img_src, (SELECT COUNT(*) as NumberOfRecipies FROM recipe r WHERE r.id_user = ${id} ) as NumberOfRecipies, (SELECT AVG(avgTab.avgScr) FROM (SELECT AVG(s.score) as avgScr FROM recipe r, score s WHERE r.id_user = ${id} AND r.id = s.id_recipe GROUP BY r.id) avgTab) as avgScore, (SELECT COUNT(*) FROM score s WHERE s.id_user = ${id} ) as NumberOfComm FROM accounts a LEFT JOIN images i ON i.id = a.id_profile_image WHERE a.ID = ${id}`; 
        db.query(
            q, [], 
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
                        avgScore : data.avgScore,
                        recipeNum : data.NumberOfRecipies,
                        commentNum : data.NumberOfComm,
                        error : 0,
                        image : {
                            id : data.id_profile_image,
                            imageURL: data.img_src
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
getAccountRecipies = (req,res) => 
{
    if(req.query.id)
    {
        let id = req.query.id;
        let q = `SELECT r.id AS id, r.name as name, r.text as text,  AVG(s.score) as \'avgSCR\', r.type as type, r.speed as speed, r.lvl as lvl, ir.img_src as imageUrl, u.id as user_id, u.nick as user_name, u.type as user_type, ia.img_src as user_imageUrl FROM recipe r LEFT JOIN accounts u ON r.id_user = u.id LEFT JOIN images ir ON r.id_mainimage = ir.id LEFT JOIN images ia ON u.id_profile_image = ia.id  LEFT JOIN score s ON s.id_recipe = r.id WHERE r.id_user = ${id} GROUP BY r.id ORDER BY avgSCR DESC`;
        db.query(
            q, [], 
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
                                name: results[i].name,
                                text: results[i].text,
                                type: results[i].type,
                                speed: results[i].speed,
                                score: results[i].avgSCR,
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
    }else{
        rF.Err(res, 500, "nie podano parametru id użytkownika")
    }
    return;
};

const Profile = {
    deleteAccount : deleteAccount, 
    updateAccount : updateAccount,
    updateAccountPasswd : updateAccountPasswd,
    updateAccountImage : updateAccountImage,
    getAccountProfile : getAccountProfile,
    getAccountRecipies : getAccountRecipies
}

module.exports = Profile;