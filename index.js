//imports
const express = require('express')
const app =  new express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')

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


//db connect
mongoose.connect('mongodb://localhost/club_archive', {useNewUrlParser:true})


//app features and functions that are being implemented
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(expressSession({
    secret: 'keyboard cat'
}))
app.use(express.static(__dirname));

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
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
})

//routing
app.get('/', homeController)
app.get('/signup',redirectIfAuthenticatedMiddleware,userSignUpController)
app.post('/adduser',redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/login',redirectIfAuthenticatedMiddleware, loginController)
app.post('/userlogin',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/userprofile', userProfileController)
app.get('/userlogout',logoutController)
app.get('/clubprofile',clubProfileController )
app.get('/clubsignup', clubSignUpController)
app.post('/addclub',redirectIfAuthenticatedMiddleware, clubStoreController)
app.get('/clublogin', redirectIfAuthenticatedMiddlewareClubs,  clublogincontroller)
app.post('/loginClub',redirectIfAuthenticatedMiddlewareClubs, loginClubController)
// app.get('/searchlanding' , (req, res) => {
//     res.render('searchLanding')
// })


