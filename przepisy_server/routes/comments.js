const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/DB');

createComment  = (req, res) => { res.status(403); };
deleteComment  = (req, res) => { res.status(403); };
updateComment  = (req, res) => { res.status(403); };

getComments = (req, res) => { res.status(403); };
const Profile = {
    createComment : createComment,
    deleteComment : deleteComment, 
    updateComment : updateComment,
    getComments : getComments
}

module.exports = Profile;