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

decodeExtraToken = (req, res, next) => {
    let token = req.headers["access-token"];
    
    req.userID = undefined;
    req.userTYPE = undefined;
    req.userADM = false;
    req.userMOD = false;
    req.userPRM = false;

    if (!token) {
        console.log("No extra token provided!"); 
        next();
        return;
    }
  
    //console.log(`Extra token ${token}`);
    jwt.verify(token, config.jwtKey, (err, decoded) => {
      if (err) {
        console.log("Bad format extra token provided!"); 
        next();
        return;
      }
      req.userID = decoded.id;
      req.userTYPE = decoded.lvl;
      switch(decoded.lvl)
      {
          case 1 : req.userADM = true; break;
          case 2 : req.userMOD = true; break;
          case 3 : req.userPRM = true; break;
          default : break;
      }
      next();
    });
};

verifyToken = (req, res, next) => {
    let token = req.headers["access-token"];
  
    if (!token) {
        console.log("No token provided!"); 
        return res.status(403).send({
            message: "No token provided!"
        });
    }
  
    console.log(`otrzymany token ${token}`);
    jwt.verify(token, config.jwtKey, (err, decoded) => {
      if (err) {
        console.log("XD?");
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userID = decoded.id;
      req.userTYPE = decoded.lvl;
      req.userADM = false;
      req.userMOD = false;
      req.userPRM = false;
      switch(decoded.lvl)
      {
          case 1 : req.userADM = true; break;
          case 2 : req.userMOD = true; break;
          case 3 : req.userPRM = true; break;
          default : break;
      }
      
      next();
    });
};

isAdmin = (req, res, next) => {
    if(req.userTYPE != 1){
        res.status(403).send({
            message: "Require Admin Role!"
        });
        return;
    };
    next();
};

isMod = (req, res, next) => {
    if(req.userTYPE > 2){
        res.status(403).send({
            message: "Require Mod Role!"
        });
        return;
    };
    next();
};

isPremium = (req, res, next) => {
    if(req.userTYPE != 3){
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
    decodeExtraToken : decodeExtraToken,
    isAdmin : isAdmin,
    isMod : isMod,
    isPremium : isPremium
}

module.exports = AuthF;