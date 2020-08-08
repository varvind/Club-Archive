const User = require('../../../../models/User')
const bcrypt = require('bcryptjs')

module.exports = async (req, res) =>{

    const user = await User.findById(req.session.userId)
    if(req.body.newPassword != ""){
        bcrypt.compare(req.body.verifyPassword, user.password, (error, same) =>{
            if(same) {
                if(req.body.newPassword != req.body.confirmNewPassword){
                    error = "New Password and Confirmation Do Not Match"
                    res.render('user_views/settings/changePassword', {
                        user,
                        error,
                        layout:'layouts/topMenuBar'
                    })
                }
                else {
                    bcrypt.hash(req.body.newPassword, 10, async function(error, hash) {
                        await User.findById(req.session.userId, (error, user)=>{
                            user.password = hash
                            user.save();
                        })
                    })
                    res.redirect('/usersettings')
                }
            }
            else {
                error = "Current Password is Incorrect"
                res.render('user_views/settings/changePassword', {
                    user,
                    error,
                    layout:'layouts/topMenuBar'
                })
            
            }
        })
    }
    else {
        res.redirect('/password')
    }
    
    
}