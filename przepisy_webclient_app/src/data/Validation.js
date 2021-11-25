module.exports.validationRegisterForm = (login, pass, nick, email) => {
    let m = "";
    if(!validateText(login))
    {
        m += " Błędny login (znaki niedopuszczalne: <, >) \n"
    }
    if(!validatePassword(pass))
    {
        m += " Błędne hasło: Hasło musi zawiearać co najmniej 8 znaków i składać się z małych i dużych liter, cyfr, znaków specjalnych\n"
    }
    if(!validateText(nick))
    {
        m += " Błędny nick (znaki niedopuszczalne: <, >) \n"
    }
    if(!validateEmail(email))
    {
        m += " Błędny email (poprawny format e-mail: email@domain.com) \n"
    }
    if(m == ""){
        return {error: false, errorMSG: ""};
    }else{
        return {error: true, errorMSG: m};
    }
}

module.exports.validationLoginForm = (login, pass) => {
    let m = ""
    if(typeof(login) != 'string' || !validateText(login)){
        m += " Błędny login (znaki niedopuszczalne: <, >) \n"
    }
    if(typeof(pass) != 'string' || !validatePassword(pass)){
        m += " Błędne hasło: Hasło musi zawiearać co najmniej 8 znaków i składać się z małych i dużych liter, cyfr, znaków specjalnych\n"
    }
    if(m == ""){
        return {error: false, errorMSG: ""};
    }else{
        return {error: true, errorMSG: m};
    }
}

module.exports.validationCommentForm = (v, recipe, comment) => {
    let m = "";
    if(!validateText(v)){ m += " Błędny text (znaki niedopuszczalne: <, >) \n" }
    if(typeof(recipe) != 'number'){ m += " Błędne id przepisu\n" }
    if(typeof(comment) != 'number'){ m += " Błędny id komentarza\n" }
    
    if(m == ""){
        return {error: false, errorMSG: "Przesłano"};
    }else{
        return {error: true, errorMSG: m};
    }
}

module.exports.validationRecipeForm = (name, text, tagsTable, type, speed, lvl, imagesID) => {
    let m = "";
    if(!validateText(name)){ m += " Błędna nazwa (znaki niedopuszczalne: <, >) \n" }
    if(!validateText(text)){ m += " Błędna nazwa (znaki niedopuszczalne: <, >) \n" }
    if(Array.isArray(tagsTable)){
        for(let i=0; i < tagsTable.length; i++)
        {
            if(typeof(tagsTable[i]) != 'string' || !validateText(tagsTable[i])){ m += " Błędny tag (znaki niedopuszczalne: <, >) \n"; break}
        }
    }
    if(typeof(type) != 'number' || type < 1 || type > 7 ){ m += " Błędny typ dania \n" }
    if(typeof(speed) != 'number' || speed < 1 || speed > 3 ){ m += " Błędny czas przygotowania dania \n" }
    if(typeof(lvl) != 'number' || lvl < 1 || type > 3 ){ m += " Błędny poziom dania \n" }
    if(!Array.isArray(tagsTable)){ m += " Błędne id obrazów\n" }
    if(m == ""){
        return {error: false, errorMSG: ""};
    }else{
        return {error: true, errorMSG: m};
    }
}

module.exports.validationRProflieForm = (nick, email) => {
    let m = "";
    if(!validateText(nick))
    {
        m += " Błędny nick (znaki niedopuszczalne: <, >) \n"
    }
    if(!validateEmail(email))
    {
        m += " Błędny email (poprawny format e-mail: email@domain.com) \n"
    }
    if(m == ""){
        return {error: false, errorMSG: ""};
    }else{
        return {error: true, errorMSG: m};
    }
}

module.exports.validationPasswordChange = (v) => {
    let m = "";
    if(!validatePassword(v))
    {
        m += " Błędne hasło: Hasło musi zawiearać co najmniej 8 znaków i składać się z małych i dużych liter, cyfr, znaków specjalnych\n"
    }
    if(m == ""){
        return {error: false, errorMSG: "zmieniono hasło"};
    }else{
        return {error: true, errorMSG: m};
    }
}

//Hasło musi zawiearać co najmniej 8 znaków i składać się z małych i dużych liter, cyfr, znaków specjalnych
const validatePassword = (v) => {
    if(typeof(v) == 'string')
    {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
    }   
    return false;
}

const validateEmail = (v) => {
    if(typeof(v) == 'string')
    {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
    }   
    return false;
}

const validateText = (v) => {
    if(typeof(v) == 'string')
    {
        return !/<|>/.test(v);
    }   
    return false;
}