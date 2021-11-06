const config = require('../config/config');
const jwt = require('jsonwebtoken');
const rF = require('../config/responses');
const db = require('../DATABASE QUERIES/DB');

createComment  = (req, res) => { rF.ReqError(res); };
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