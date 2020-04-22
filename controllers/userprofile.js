const User = require('../models/User')
const Club = require('../models/Club')
module.exports = async (req, res) => {
    let userclubs = [];
    const user = await User.findById(req.session.userId)
    const clubs = req.session.searches
    //console.log(userclubs)
    
    res.render('userProfile', {
        user,
        clubs
    })
}