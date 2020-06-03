const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{
    console.log(req.params.clubid)
    const club = await Club.findOne({_id: req.params.clubid}, (found) => {
        if(found){
            console.log(user_applied.firstname)
        }else{
            console.log('Club not found')
        }
    })
    const user = await User.findById(req.session.userId)
    const user_applied = await User.findOne({_id: req.params.userid}, (found) => {
        if(found){
            console.log(user_applied.firstname)
        }else{
            console.log('User applied not found')
        }
    })
    
    
    let application = null
    club.member_applications.forEach(user_app => {
        if(String(user_app.userId) == String(req.params.userid)){
            application = user_app
        }
    });

    setTimeout( () => {
        res.render('singleMemberApplication' ,{
            club,
            user, 
            user_applied, 
            application
        })    
    }, 2000)

    
}