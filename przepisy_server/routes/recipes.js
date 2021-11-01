const config = require('../config/config');
const jwt = require('jsonwebtoken');
const db = require('../DATABASE QUERIES/dbQueries');

getRecipes = (req, res) => {
    res.status(403);
};

getRecipe = (req, res) => {
    res.status(403);
};

postRecipe = (req, res) => {
    res.status(403);
};

deleteRecipe = (req, res) => {
    res.status(403);
};

updateRecipe = (req, res) => {
    res.status(403);
};

const Recipes = {
    getRecipes : getRecipes,
    getRecipe : getRecipe,
    postRecipe : postRecipe,
    deleteRecipe : deleteRecipe,
    updateRecipe : updateRecipe
}

module.exports = Recipes;