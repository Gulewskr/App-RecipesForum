const config = require('./config');

const jwt = require('jsonwebtoken');

acessPublic = (req, res) => {
    res.status(200).send("Public Content.");
};

acessUser = (req, res) => {
    res.status(200).send("User Content.");
};

acessMod = (req, res) => {
    res.status(200).send("Moderator Content.");
};

acessAdmin = (req, res) => {
    res.status(200).send("Admin Content.");
};

verifyToken = (req, res, next) => {
    let token = req.headers["access-token"];
  
    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }
  
    console.log(`otrzymany token ${token}`);
    jwt.verify(token, config.jwtKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      req.userLvL = decoded.lvl;
      next();
    });
};

isAdmin = (req, res, next) => {
    if(req.userLvL != 1){
        res.status(403).send({
            message: "Require Admin Role!"
        });
        return;
    };
    next();
};

isMod = (req, res, next) => {
    if(req.userLvL > 2){
        res.status(403).send({
            message: "Require Mod Role!"
        });
        return;
    };
    next();
};

isPremium = (req, res, next) => {
    if(req.userLvL != 3){
        res.status(403).send({
            message: "Require Premium Role!"
        });
        return;
    };
    next();
}

const AuthF = {
    acessPublic : acessPublic,
    acessUser : acessUser,
    acessMod : acessMod,
    acessAdmin : acessAdmin,
    verifyToken : verifyToken,
    isAdmin : isAdmin,
    isMod : isMod,
    isPremium : isPremium
}

module.exports = AuthF;