const User = require('../../../models/User')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    
    res.render('search/searchLanding', {
        user,
        layout:false
    })
}