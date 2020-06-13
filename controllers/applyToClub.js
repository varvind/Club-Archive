const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    if(req.file && req.file.mimetype != "application/pdf"){
        error = "File type invalid, please upload a pdf"
        res.render('onlineClubApplication',  {
            club,
            error
        })
    }
    else {
        let applicationForUser = {clubId: club._id,  name: club.name, type: "member", status: "Pending"}
        user.pending_applications.push(applicationForUser)
        user.save()
        console.log(req.file)
        let applicationForClub = {
            userId: user._id,
            fullname: req.body.fullname || "",
            email: req.body.email || "",
            rank: req.body.rank || "",
            major: req.body.major || "",
            resume : req.file.filename || "",
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