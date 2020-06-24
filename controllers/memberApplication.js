const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    const club = await Club.findById(req.params.id)

    if(!user || !club){
        console.log('Invalid user or club')
        res.redirect('/')
    }else{
        res.render('designApplication', {club, user,
            layout:'layouts/topMenuBar'})
    }
}