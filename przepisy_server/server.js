const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const port = 3001

const AuthF = require('./config/authorization');
const ReciF = require('./routes/recipes');
const CommF = require('./routes/comments');
const ProfF = require('./routes/profile');
const AccF = require('./routes/accounts');
const ScrF = require('./routes/score');
const ImgF = require('./routes/images');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//Upublicznienie folderu images
app.use('/images', express.static('images'));

app.use(function(request, response, next){
	// Website allowed to connect
	response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // allowed request metod
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // allowed request headers
    response.setHeader('Access-Control-Allow-Headers', 'Access-token, content-type');
    // allow cookies in requests
    response.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
/*
	Logowanie:
	błędy :
		0 - brak
		1 - błędny login/hasło
		2 - błąd serwera
*/
app.post('/auth', AccF.login );
app.post('/authByJWT', [AuthF.verifyToken], AccF.loginByJWT);
app.post('/register', AccF.register );

//sprawdzanie czy uprawniony użytkownik
//id przepisu i ewentualnie id komentarza do którego pisana jest odpowiedź
//Moderatorzy i użytkownicy do których należy post

app.get('/profile', [AuthF.decodeExtraToken], ProfF.getAccountProfile);
app.get('/profile/recipies', [AuthF.decodeExtraToken], ProfF.getAccountRecipies);
//Chyba nie potrzebny endpoint
//app.post('/profile', [AuthF.verifyToken], ProfF.createAccount);
app.put('/profile', [AuthF.verifyToken], ProfF.updateAccount);
app.put('/profile/pass', [AuthF.verifyToken], ProfF.updateAccountPasswd);
app.put('/profile/image', [AuthF.verifyToken], ProfF.updateAccountImage);
app.delete('/profile', [AuthF.verifyToken], ProfF.deleteAccount);

/*	prametry:
		-id przepisu
*/
app.get('/comments', [AuthF.decodeExtraToken], CommF.getComments);
//		-id user
//		-id komentarza (dodatkowy jak odpowiada się na inny komentarz)
app.post('/comment', [AuthF.verifyToken], CommF.createComment);
app.put('/comment', [AuthF.verifyToken], CommF.updateComment);
app.delete('/comment', [AuthF.verifyToken], CommF.deleteComment);

/*	prametry:
		-id user
		-id przepisu
*/
app.get('/score', [AuthF.decodeExtraToken], ScrF.getRecipeScore);
//		-ocena
app.put('/score', [AuthF.verifyToken], ScrF.updateScore);


/*	prametry:
		-id
*/
app.get('/recipe', [AuthF.decodeExtraToken], ReciF.getRecipe);
app.get('/recipeTag', [AuthF.decodeExtraToken], ReciF.getTagsForRecipe);
app.get('/recipeImage', [AuthF.decodeExtraToken], ReciF.getImagesForRecipe);
//		-id user
app.post('/recipe', [AuthF.verifyToken], ReciF.postRecipe);
app.put('/recipe', [AuthF.verifyToken], ReciF.updateRecipe);
app.delete('/recipe', [AuthF.verifyToken], ReciF.deleteRecipe);

/*	prametry:
		-typy sortowania
		-nr strony
*/
app.get('/recipes', [AuthF.decodeExtraToken], ReciF.getRecipes);
//TODO dodać sortowanie względem first top5
app.get('/recipesTop', [AuthF.decodeExtraToken], ReciF.getRecipes);
app.get('/tags', [AuthF.decodeExtraToken], ReciF.getTags);

var storagePro = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'images/profile')
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + '.png') //Appending .jpg
	}
})
var storageRec = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images/recipes')
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '.png') //Appending .jpg
	}
})
const uploadImageProfile = multer({ storage: storagePro});
const uploadImageRecipe = multer({ storage: storageRec});
app.post('/imagesProfile', [AuthF.verifyToken, uploadImageProfile.single("uploaded_image")], ImgF.addImage );
app.post('/imagesRecipe', [AuthF.verifyToken, uploadImageRecipe.single("uploaded_image")], ImgF.addImage );

app.listen(port, () => { console.log(`Server is working on port ${port}`)});