const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    console.log(req.body)
    const club = await Club.findById(req.params.id, (err, found) => {
        if(!found || err){
            console.log("Error Finding CLub")
        }else{
            found.onlineApplication.allow = (req.body.allowApplication == "true") ? true : false

            found.onlineApplication.fullname =  (req.body.fullname == "true") ? true : false
            found.onlineApplication.email =  (req.body.email == "true") ? true : false
            found.onlineApplication.rank =  (req.body.classRank == "true") ? true : false
            found.onlineApplication.major =  (req.body.major == "true") ? true : false
            found.onlineApplication.resume =  (req.body.resume == "true") ? true : false

            found.onlineApplication.custom1 = req.body.custom1 || ""
            found.onlineApplication.custom2 = req.body.custom2 || ""
            found.onlineApplication.custom3 = req.body.custom3 || ""

            found.save()
        }
    })
  
    res.redirect('/')
}