const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)

    if(!club){
        console.log('Invalid club')
    }else{
        club.onlineApplication.allow = (req.body.allowApplication == "true") ? true : false
        
        club.onlineApplication.fullname =  (req.body.fullname == "true") ? true : false
        club.onlineApplication.email =  (req.body.email == "true") ? true : false
        club.onlineApplication.rank =  (req.body.classRank == "true") ? true : false
        club.onlineApplication.major =  (req.body.major == "true") ? true : false
        club.onlineApplication.resume =  (req.body.resume == "true") ? true : false

        club.onlineApplication.custom1 = req.body.custom1 || ""
        club.onlineApplication.custom2 = req.body.custom2 || ""
        club.onlineApplication.custom3 = req.body.custom3 || ""

        club.save()
    }
    res.redirect('/')
}