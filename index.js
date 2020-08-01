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
const expressLayouts = require('express-ejs-layouts')
//routes
const authMiddleWare = require('./middleware/authMiddleware')
const userSignUpController = require('./controllers/user/signup/view/newUser')
const homeController = require('./controllers/home/home')
const storeUserController = require('./controllers/user/signup/impl/storeUser')
const fileUpload = require('express-fileupload')
const loginController = require('./controllers/user/login/view/login')
const loginUserController = require('./controllers/user/login/impl/loginUser')
const expressSession = require('express-session')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const redirectIfAuthenticatedMiddlewareClubs = require('./middleware/redirectIfAuthenticatedMiddlewareClubs')
const userProfileController = require('./controllers/user/profile/view/userprofile')
const logoutController = require('./controllers/user/login/impl/logout')
const clubProfileController = require('./controllers/club/profile/view/clubProfile')
const clubSignUpController = require('./controllers/club/signup/view/clubSignUp')
const clubStoreController = require('./controllers/club/signup/impl/storeClub') 
const clublogincontroller = require('./controllers/club/login/view/clubloginpage')
const loginClubController = require('./controllers/club/login/impl/loginClub')
const searchLandingController = require('./controllers/search/view/searchLanding')
const searchController = require('./controllers/search/impl/search') 
const aboutPageController = require('./controllers/home/about')
const howToController = require('./controllers/home/howTo')
const userSettingsController = require('./controllers/user/settings/view/usersettings')
const updateUserController = require('./controllers/user/settings/impl/updateUser')
const passwordChangeController = require('./controllers/user/settings/view/changePassword')
const updatePasswordController = require('./controllers/user/settings/impl/updatePassword')
const clubSettingsController = require('./controllers/club/settings/profile/view/clubSettings')
const updateClubController = require('./controllers/club/settings/profile/impl/updateClub')
const forgotPasswordController = require('./controllers/user/password_reset/view/forgotPassword')
const resetUserPasswordController = require('./controllers/user/password_reset/impl/resetUserPassword')
const resetUserPasswordController2 = require('./controllers/user/password_reset/view/userReset')
const newUserPasswordController = require('./controllers/user/password_reset/impl/newUserPassword')
const clubMarkettingSettingsController = require('./controllers/club/settings/tags/view/clubMarkettingSettings')
const updateClubTagsController = require('./controllers/club/settings/tags/impl/updateClubTags')
const deleteclubTagController = require('./controllers/club/settings/tags/impl/deleteTag')
const adminregistrationController = require('./controllers/club/applications/admin/view/adminregistration')
const adminregistrationapplyController = require('./controllers/club/applications/admin/impl/adminregistrationpost')
const adminapplicationsettingscontroller = require('./controllers/club/settings/manage_members/admin/view/clubadminappsettings')
const submitadminapplicationcontroller = require('./controllers/club/settings/manage_members/admin/impl/submitadminapplication')
const deleteuserapplicationcontroller = require('./controllers/user/application_control/impl/deleteUserApplication')
const applicationDesignController = require('./controllers/club/settings/application_control/view/memberApplication')
const addOnlineApplicationController = require('./controllers/club/settings/application_control/impl/addApplication')
const onlineClubApplicationController = require('./controllers/club/applications/member/view/onlineClubApplication')
const applyToClubApplication = require('./controllers/club/applications/member/impl/applyToClub')
const allMemberApplicationsController = require('./controllers/club/settings/application_control/view/allMemberApplications')
const singleMemberApplicationController = require('./controllers/club/settings/manage_members/member/view/singleMemberApplication')
const approveMemberApplicationController = require('./controllers/club/settings/manage_members/member/impl/approveMemberApplication')
const clubarchiveadminviewcontroller = require('./controllers/clubarchiveapproved/view/clubarchiveadminview')
const clubprofilesettingscontroller = require('./controllers/club/settings/profile/view/clubprofilesettings')
const submitclubarchiveapprovedappcontroller = require('./controllers/club/settings/profile/impl/submitclubarchiveapp')
const clubapprovalprocessedcontroller = require('./controllers/clubarchiveapproved/view/submitapprovalapp')
const confirmclubdeletepagecontroller = require('./controllers/club/settings/profile/view/confirmclubdeletepage')
const confirmclubdeletecontroller = require('./controllers/club/settings/profile/impl/confirmclubdelete')
const manageAllMembersController = require('./controllers/club/settings/manage_members/all/view/manageAllMembers')
const editClubPriviledgesController = require('./controllers/club/settings/manage_members/all/impl/editClubPriviledges')
const addclubImageController = require('./controllers/club/settings/image_control/impl/addClubImage')
const deleteClubImageController = require('./controllers/club/settings/image_control/impl/deleteClubImage')
const deleteSearchHistoryController = require('./controllers/user/profile/impl/deleteSearchHistory')
const rateClubController = require('./controllers/club/ratings/impl/rateClub')
const clubannouncementsviewController = require('./controllers/club/settings/announcements/view/clubannouncements')
const processClubAnnouncementController = require('./controllers/club/settings/announcements/impl/processAnnouncement')
const notificationsPageViewController = require('./controllers/user/inbox/view/notificationsPage')

const feedBackFormController = require('./controllers/beta/view/feedbackForm')
const requestRecordedController = require('./controllers/beta/view/requestRecorded')
const feedbacksubmissioncontroller = require('./controllers/beta/impl/submitfeedback')
const updateAnnouncementController = require('./controllers/club/settings/announcements/impl/updateAnnouncement')
const removeAnnouncementController = require('./controllers/club/settings/announcements/impl/removeAnnouncement')
const markReadController = require('./controllers/user/inbox/impl/markNotificationRead')
const removeFromInboxController = require('./controllers/user/inbox/impl/removeInboxItem')
const markAllReadController = require('./controllers/user/inbox/impl/markallread')
const club_settings_history_controller = require('./controllers/club/settings/history/view/club_settings_history_view')
const deleteClubSettingsHistoryController = require('./controllers/club/settings/history/impl/clear_club_settings_history')
const inviteNewMembersController = require('./controllers/club/settings/invite_members/view/inviteMembers')
const emailNewMembersController = require('./controllers/club/settings/invite_members/impl/emailNewMembers')
const joinClubRenderController = require('./controllers/club/settings/invite_members/view/joinClubRender')
const joinClubPostController = require('./controllers/club/settings/invite_members/view/joinClubPost')
//app features and functions that are being implemented
app.use(bodyParser.json())
app.use(expressLayouts)
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


global.gfs;
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

//to use ejs for the app
app.set('view engine', 'ejs')
//port 3000 for output
app.listen(process.env.PORT || 3000)

//check if the user is logged in
//global variable that can be utilized in all files
//senses the cookies
global.loggedIn = null
global.clubloggedin = null
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    clubloggedin = req.session.clubId;
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
app.get('/post/:id',clubProfileController)
app.get('/forgotpassword',forgotPasswordController)
app.get('/aboutus', aboutPageController)
app.get('/howtoregister',howToController)
app.get('/usersettings',userSettingsController)
app.post('/updateuser',upload.single('image'), updateUserController)
app.get('/profile_password', passwordChangeController)
app.post('/updatepassword', updatePasswordController)
app.get('/clubsettings/:id', clubSettingsController)
app.post('/updateclub/:id', upload.array('images', 10), updateClubController)
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
app.post('/addClubImage/:id', upload.single('image'), addclubImageController)
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
app.post('/:club_id/deleteClubImage/:filename', deleteClubImageController)
app.get('/deleteSearchHistory', deleteSearchHistoryController)
app.post('/:clubId/rateclub', rateClubController)

app.get('/betatest', feedBackFormController)
app.get('/requestrecorded', requestRecordedController)
app.post('/submitfeedback', upload.array('images', 10), feedbacksubmissioncontroller)
app.get('/clubannouncements/:id', clubannouncementsviewController)
app.post('/sendnnoucement/:id', processClubAnnouncementController)
app.get('/notificationsPage', notificationsPageViewController)
app.post('/updateAnnouncement/:id/:visibility/:announcement_index', updateAnnouncementController)
app.get('/removeAnnouncement/:id/:visibility/:announcement_index', removeAnnouncementController )
app.post('/markRead/:notification_index', markReadController)
app.get('/removeinboxitem/:inbox_index', removeFromInboxController)
app.get('/markallread', markAllReadController )
app.get('/club_settings_history/:id',  club_settings_history_controller)
app.get('/:club_id/invitemembers', inviteNewMembersController)
app.post('/:club_id/invitemembers', emailNewMembersController)
app.get('/:club_id/joinclub', joinClubRenderController)
app.post('/:club_id/joinclub', joinClubPostController)

app.get('/clearClubSettingsHistory/:clubId', deleteClubSettingsHistoryController)