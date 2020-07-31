const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id, async (err, found) => {
        if(!found || err){
            console.log("Error Finding CLub")
        }else{
            const user = await User.findById(req.session.userId)
            const settings_message = {User: user.firstName + " " + user.lastName, Type: `Created User Application`, Date: date, Time: time}
            club.settings_history.unshift(settings_message)
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