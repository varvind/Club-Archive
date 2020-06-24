const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{
    const club = await Club.findById(req.params.clubid)
    const user = await User.findById(req.session.userId)

    res.render('allMemberApplications' ,{club,user,
        layout:'layouts/topMenuBar'})    
}