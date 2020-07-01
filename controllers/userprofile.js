const User = require('../models/User')
const Club = require('../models/Club')


module.exports = async (req, res) => {
    if(!loggedIn){
        res.redirect('/')
    } else {
        const clubs = req.session.searches
    const user = await User.findById(req.session.userId, (err, foundUser) => {
        if(err || !foundUser){
            console.log("Problem finding User")
        }
    })

    const clubNames = new Array()
    user.clubs.forEach(eachClub => {
        Club.findById(eachClub, (err, foundClub) => {
            if(err || !foundClub){
                console.log("No club found")
            }else{
                //console.log(foundClub.name)
                clubNames.push(foundClub.name)
            }
        })
    })

    setTimeout( () => {
        res.render('userProfile', {
            user,
            clubs,
            clubNames,
            layout : 'layouts/topMenuBar'
        })
    }, 2000)
    }
    
}