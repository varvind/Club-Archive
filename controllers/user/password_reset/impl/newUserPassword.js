const ResetPassword = require('../../../../models/ResetPassword')
const User = require('../../../../models/User')
const bcrypt = require('bcrypt')

module.exports = (req, res) => {
    console.log(`The req.body.resetId is ${req.body.resetId}`)
    if(req.body.newPassword != req.body.verifyPassword){
        res.render('user_views/settings/userReset', {error: "Verify Password", layout:false})
    }else{
        ResetPassword.findOne({resetPasswordToken: req.body.resetId}, (err, resetPassword) => {
            if(err || !resetPassword){
                res.render('user_views/login', {error: "Reset Token Not Found", layout:false})
            } else{
                console.log(resetPassword._id)
                const verifiedPassword = req.body.newPassword
                User.findOne({_id: resetPassword.userId }, (error, user) => {
                    if(error || !user){
                        res.render('user_views/login', {error: "Error Finding User", layout:false})
                    }else{
                        bcrypt.hash(verifiedPassword, 10, async function(error, hash) {
                            user.password = hash
                            user.save()
                            console.log("Updated User Password")
                        })
                    }
                })
                resetPassword.remove();
            }
        })
    }
    res.redirect('/')
}