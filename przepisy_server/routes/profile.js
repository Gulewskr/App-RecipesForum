const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/dbQueries');

createAccount  = (req, res) => { res.status(403); };
deleteAccount  = (req, res) => { res.status(403); };
updateAccount  = (req, res) => { res.status(403); };

const Profile = {
    createAccount : createAccount,
    deleteAccount : deleteAccount, 
    updateAccount : updateAccount
}

module.exports = Profile;