if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}




//imports
const express = require('express')
const app =  new express()
const mongoose = require('mongoose')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const validator = require('express-validator') //new
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')
const path = require('path')
//routes
const authMiddleWare = require('./middleware/authMiddleware')
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
const aboutPageController = require('./controllers/about')
const howToController = require('./controllers/howTo')
const userSettingsController = require('./controllers/usersettings')
const updateUserController = require('./controllers/updateUser')
const passwordChangeController = require('./controllers/changePassword')
const updatePasswordController = require('./controllers/updatePassword')
const clubSettingsController = require('./controllers/clubSettings')
const updateClubController = require('./controllers/updateClub')
const forgotPasswordController = require('./controllers/forgotPassword')
const resetUserPasswordController = require('./controllers/resetUserPassword')
const resetUserPasswordController2 = require('./controllers/userReset')
const newUserPasswordController = require('./controllers/newUserPassword')
const clubMarkettingSettingsController = require('./controllers/clubMarkettingSettings')
const updateClubTagsController = require('./controllers/updateClubTags')
const deleteclubTagController = require('./controllers/deleteTag')
const adminregistrationController = require('./controllers/adminregistration')
const adminregistrationapplyController = require('./controllers/adminregistrationpost')
const adminapplicationsettingscontroller = require('./controllers/clubadminappsettings')
const submitadminapplicationcontroller = require('./controllers/submitadminapplication')
const deleteuserapplicationcontroller = require('./controllers/deleteUserApplication')
const applicationDesignController = require('./controllers/memberApplication')
const addOnlineApplicationController = require('./controllers/addApplication')
const onlineClubApplicationController = require('./controllers/onlineClubApplication')
const applyToClubApplication = require('./controllers/applyToClub')
const allMemberApplicationsController = require('./controllers/allMemberApplications')
const singleMemberApplicationController = require('./controllers/singleMemberApplication')
const approveMemberApplicationController = require('./controllers/approveMemberApplication')
const clubarchiveadminviewcontroller = require('./controllers/clubarchiveadminview')
const clubprofilesettingscontroller = require('./controllers/clubprofilesettings')
const submitclubarchiveapprovedappcontroller = require('./controllers/submitclubarchiveapp')
const clubapprovalprocessedcontroller = require('./controllers/submitapprovalapp')
const confirmclubdeletepagecontroller = require('./controllers/confirmclubdeletepage')
const confirmclubdeletecontroller = require('./controllers/confirmclubdelete')
const manageAllMembersController = require('./controllers/manageAllMembers')
const editClubPriviledgesController = require('./controllers/editClubPriviledges')

//app features and functions that are being implemented
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))
//app.use(fileUpload())
app.use(expressSession({
    secret: 'keyboard cat'
}))
app.use(express.static(__dirname));




//db connect
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE_URL)
const conn = mongoose.createConnection(process.env.DATABASE_URL)


let gfs;
conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo)
    gfs.collection('uploads')
})

var storage = new GridFsStorage({
  url: process.env.DATABASE_URL,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


// //multer
// const multer = require('multer')
// const path = require('path')

// var storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'public/herokuclub_images');
//     },
//     filename: function(req, file, cb){ 
//         cb(null, Date.now() + '-' + file.originalname)
//     }
// })

// var upload = multer({ storage:storage })

//to use ejs for the app
app.set('view engine', 'ejs')

//port 3000 for output
app.listen(process.env.PORT || 3000)

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
app.post('/adduser',upload.single('image'), storeUserController)
app.get('/login',redirectIfAuthenticatedMiddleware, loginController)
app.post('/userlogin',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/userprofile', userProfileController)
app.get('/userlogout',logoutController)
//app.get('/clubprofile',clubProfileController )
app.get('/clubsignup', clubSignUpController)
app.post('/addclub', upload.array('images', 10), clubStoreController)
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
app.get('/aboutus', aboutPageController)
app.get('/howtoregister',howToController)
app.get('/usersettings',userSettingsController)
app.post('/updateuser',upload.single('image'), updateUserController)
app.get('/profile_password', passwordChangeController)
app.post('/updatepassword', updatePasswordController)
app.get('/clubsettings/:id', clubSettingsController)
app.post('/updateclub/:id', upload.single('image'), updateClubController)
app.get('/forgotpassword',forgotPasswordController)
app.post('/forgotpassword', resetUserPasswordController)
app.get('/userReset', resetUserPasswordController2)
app.post('/newUserPassword', newUserPasswordController)
app.get('/clubMarkettingSettings/:id', clubMarkettingSettingsController)
app.post('/updatetags/:id', updateClubTagsController)
app.get('/deletetag/:id/:tagName', deleteclubTagController)
app.get('/adminregistration/:id', authMiddleWare, adminregistrationController)
app.get('/submitadminapplication/:id', adminregistrationapplyController)
app.get('/clubAdminApplications/:id', adminapplicationsettingscontroller)
app.post('/submitadminapplication/:userId/:clubId', submitadminapplicationcontroller)
app.get('/deleteapplication/:id', deleteuserapplicationcontroller)
app.get('/clubMemberApplicationDesign/:id', authMiddleWare, applicationDesignController)
app.post('/addapplication/:id', authMiddleWare, addOnlineApplicationController)
app.get('/:id/applyonline', authMiddleWare, onlineClubApplicationController)
app.post('/add-application/:id', upload.single('resume'), applyToClubApplication)
app.get('/:clubid/club-applications', allMemberApplicationsController)
app.get('/:club_id/club-applications/:user_id', singleMemberApplicationController)
app.post('/:club_id/club-applications/:user_id', approveMemberApplicationController)
app.get('/clubarchiveadmin',clubarchiveadminviewcontroller)
app.get('/clubprofilesettings/:id', clubprofilesettingscontroller)
app.post('/submitapprovalapp/:id',submitclubarchiveapprovedappcontroller)
app.post('/clubarchiveapprovedprocessed/:id',clubapprovalprocessedcontroller)
app.get('/confirmdeletepage/:id',confirmclubdeletepagecontroller)
app.post('/submitclubdelete/:id',confirmclubdeletecontroller)
app.get('/:id/manage-members', manageAllMembersController)
app.post('/:club_id/edit-user-priviledges/:user_id', editClubPriviledgesController)
app.get('/image/:filename', async (req, res) => {
    const file = await gfs.files.findOne({filename : req.params.filename})
    const readstream = gfs.createReadStream(file.filename)
    readstream.pipe(res)
})
app.get('/resume/:filename', async (req, res) => {
  const file = await gfs.files.findOne({filename : req.params.filename})
  const readstream = gfs.createReadStream(file.filename)
  readstream.pipe(res)
})

