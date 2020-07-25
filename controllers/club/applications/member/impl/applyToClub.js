const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
    var time = "";
    if(today.getUTCHours() - 5 > 12) {
            time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
            time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
            time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
            time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    if(req.file && req.file.mimetype != "application/pdf"){
        error = "File type invalid, please upload a pdf"
        res.render('club_views/user_applications/member/onlineClubApplication',  {
            club,
            error,
            layout:false
        })
    }
    else {
        let filename;
        if(!req.file){
            filename = "";
        } else {
            filename = req.file.filename
        }
        let applicationForUser = {clubId: club._id,  name: club.name, type: "member", status: "Pending"}
        user.pending_applications.push(applicationForUser)
        var app_notification = {subject: `Application Submission: Member for ${club.name}`, body : `Application for member of ${club.name} has been submitted! Be sure to check your inbox for updates on your status!`, date : date, time : time, club : club.name, status: "unread", type :"application"}
        user.inbox.unshift(app_notification)
        user.save()
        console.log(req.file)
        let applicationForClub = {
            userId: user._id,
            fullname: req.body.fullname || "",
            email: req.body.email || "",
            rank: req.body.rank || "",
            major: req.body.major || "",
            resume : filename,
            custom1: {
                question: club.onlineApplication.custom1 || "",
                answer: req.body.custom1 || ""
            },
            custom2: {
                question: club.onlineApplication.custom2 || "",
                answer: req.body.custom2 || ""
            },
            custom3: {
                question: club.onlineApplication.custom3 || "",
                answer: req.body.custom3 || ""
            },
            status: "Pending"
        }
        club.member_applications.push(applicationForClub)
        club.save()

        res.redirect('/')
    }
    
}