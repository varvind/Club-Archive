const express = require('express')
const app =  new express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const userSignUpController = require('./controllers/newUser')
const homeController = require('./controllers/home')
const storeUserController = require('./controllers/storeUser')
const fileUpload = require('express-fileupload')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const expressSession = require('express-session')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const userProfileController = require('./controllers/userprofile')
const logoutController = require('./controllers/logout')
const clubProfileController = require('./controllers/clubProfile')
const clubSignUpController = require('./controllers/clubSignUp')
mongoose.connect('mongodb://localhost/club_archive', {useNewUrlParser:true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())
app.use(expressSession({
    secret: 'keyboard cat'
}))


app.use(express.static(__dirname));
app.set('view engine', 'ejs')


app.listen(3000, 
    console.log("listening on port 3000")
)

global.loggedIn = null
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
})
app.get('/', homeController)
app.get('/signup',redirectIfAuthenticatedMiddleware,userSignUpController)
app.post('/adduser',redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/login',redirectIfAuthenticatedMiddleware, loginController)
app.post('/userlogin',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/userprofile', userProfileController)
app.get('/userlogout',logoutController)
app.get('/clubprofile',clubProfileController )
app.get('/clubsignup', clubSignUpController)


// app.get('/searchlanding' , (req, res) => {
//     res.render('searchLanding')
// })


