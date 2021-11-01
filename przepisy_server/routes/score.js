const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/dbQueries');

createScore  = (req, res) => { res.status(403); };
deleteScore  = (req, res) => { res.status(403); };
updateScore  = (req, res) => { res.status(403); };

getRecipeScore = (req, res) => { res.status(403); };

const Score = {
    createScore : createScore,
    deleteScore : deleteScore, 
    updateScore : updateScore,
    getRecipeScore: getRecipeScore
}

module.exports = Score;