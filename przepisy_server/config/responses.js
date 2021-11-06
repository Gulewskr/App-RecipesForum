Status200 = (res) => {
    res.sendStatus(200);
    res.end();  
}

Status200WithData = (res, data) => {
    res.status(200).send(data);
    res.end();  
}

DataBaseError = (res) => {
    res.status(500).send({
        error : 1,
        errorMSG : "wystąpił błąd bazy danych"
    });
    res.end();
}

BadRequestError = (res) => {
    res.status(403).send({
        error : 1,
        errorMSG : "Błędne żądanie"
    });
    res.end();
}

NoAuthToPerform = (res) => {
    res.status(400).send({
        error : 1,
        errorMSG : "Nie posiadasz uprawnień do tej operacji"
    });
    res.end();
}

CustomErr = (res, numb, text) => {
    res.status(numb).send({
        error : 1,
        errorMSG : text
    });
    res.end();
}

name = (res) => {
    
}

const Responses = {
    Correct : Status200, 
    CorrectWData : Status200WithData,
    DBError : DataBaseError,
    ReqError : BadRequestError,
    NoAuth : NoAuthToPerform,
    Err : CustomErr
}

module.exports = Responses;