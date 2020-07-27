const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    await Club.findById(req.params.club_id, async (err, club) => {
        if(err || !club){
            console.log(err || "Club Not Found")
            res.redirect('/')
        }else{
            await User.findById(req.session.userId, (errr, user) => {
                if(errr || !user){
                    console.log(errr || "User Not Found")
                    res.redirect('/login')
                }else{
                    res.render('joinClub', {
                        club,
                        user,
                        error: null,
                        layout:'layouts/topMenuBar'
                    })
                }
            })
        }
    })
}