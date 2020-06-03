const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) =>{
    let application = null
    const club = await Club.findById(req.params.club_id, (err, found) => {
        if(!found || err){
            console.log(`Error ${err}`)
        }else{
            found.member_applications.forEach(user_app => {
                if(String(user_app.userId) == String(req.params.user_id)){
                    application = user_app
                }
            });
        }
    })

    const user = await User.findById(req.session.userId)
    const user_applied = await User.findById(req.params.user_id)    

    setTimeout( () => {
        res.render('singleMemberApplication' ,{
            club,
            user, 
            user_applied, 
            application
        })    
    }, 1000)

    
}