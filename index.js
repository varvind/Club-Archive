//imports
const express = require('express')
const app =  new express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const validator = require('express-validator') //new
//routes
const userSignUpController = require('./controllers/newUser')
const homeController = require('./controllers/home')
const storeUserController = require('./controllers/storeUser')
const fileUpload = require('express-fileupload')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const expressSession = require('express-session')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const redirectIfAuthenticatedMiddlewareClubs = require('./middleware/redirectIfAuthenticatedMiddlewareClubs')
const userProfileController = require('./controllers/userprofile')
const logoutController = require('./controllers/logout')
const clubProfileController = require('./controllers/clubProfile')
const clubSignUpController = require('./controllers/clubSignUp')
const clubStoreController = require('./controllers/storeClub')
const clublogincontroller = require('./controllers/clubloginpage')
const loginClubController = require('./controllers/loginClub')
const searchLandingController = require('./controllers/searchLanding')
const searchController = require('./controllers/search')
const academicSearchController = require('./controllers/searchAcademic')
const sportsSearchController = require('./controllers/searchSports')
const greekSearchController = require('./controllers/searchGreek')
const specialSearchController = require('./controllers/searchSpecial')
const forgotPasswordController = require('./controllers/forgotPassword')
//db connect
mongoose.connect('mongodb://localhost/club_archive', {useNewUrlParser:true})


//app features and functions that are being implemented
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
//app.use(fileUpload())
app.use(expressSession({
    secret: 'keyboard cat'
}))
app.use(express.static(__dirname));

//multer
const multer = require('multer')
const path = require('path')

var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/club_images');
    },
    filename: function(req, file, cb){ 
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({ storage:storage })

//to use ejs for the app
app.set('view engine', 'ejs')

//port 3000 for output
app.listen(3000, 
    console.log("listening on port 3000")
)

//check if the user is logged in
//global variable that can be utilized in all files
//senses the cookies
global.loggedIn = null
global.clubloggedin = null
global.searches = [] //new
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    clubloggedin = req.session.clubId;
    searches = req.session.searches || []; //new
    next()
})
console.log(clubloggedin)



//routing
app.get('/', homeController)
app.get('/signup',redirectIfAuthenticatedMiddleware,userSignUpController)
app.post('/adduser',redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/login',redirectIfAuthenticatedMiddleware, loginController)
app.post('/userlogin',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/userprofile', userProfileController)
app.get('/userlogout',logoutController)
//app.get('/clubprofile',clubProfileController )
app.get('/clubsignup', clubSignUpController)
app.post('/addclub', upload.array('clubImages', 10), clubStoreController)
app.get('/clublogin', redirectIfAuthenticatedMiddlewareClubs,  clublogincontroller)
app.post('/loginClub',redirectIfAuthenticatedMiddlewareClubs, loginClubController)
app.get('/searchlanding', searchLandingController)
app.get('/search', searchController)
app.get('/academicSearch',academicSearchController)
app.get('/sportSearch',sportsSearchController)
app.get('/greekSearch',greekSearchController)
app.get('/specialSearch',specialSearchController)
app.get('/post/:id',clubProfileController)
app.get('/forgotpassword',forgotPasswordController)
// app.get('/searchlanding' , (req, res) => {
//     res.render('searchLanding')
// })

