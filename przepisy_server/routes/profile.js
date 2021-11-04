const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/DB');

createAccount  = (req, res) => { res.status(403); };
deleteAccount  = (req, res) => { res.status(403); };
updateAccount  = (req, res) => { res.status(403); };
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
                    res.status(500).send({
                        error : 1,
                        errorMSG : "wystąpił błąd bazy danych"
                    });
                    res.end();
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
                    res.status(200).send({
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
            errorMSG : "nie podano parametru id użytkownika"
        });
        res.end();
    }
    return;
};

const Profile = {
    createAccount : createAccount,
    deleteAccount : deleteAccount, 
    updateAccount : updateAccount,
    getAccountProfile : getAccountProfile
}

module.exports = Profile;