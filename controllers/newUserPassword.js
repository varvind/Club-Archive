const ResetPassword = require('../models/ResetPassword')
const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports = (req, res) => {
    console.log(`The req.body.resetId is ${req.body.resetId}`)
    if(req.body.newPassword != req.body.verifyPassword){
        res.render('userReset', {error: "Verify Password"})
    }else{
        ResetPassword.findOne({resetPasswordToken: req.body.resetId}, (err, resetPassword) => {
            if(err || !resetPassword){
                res.render('login', {error: "Reset Token Not Found"})
            } else{
                console.log(resetPassword._id)
                const verifiedPassword = req.body.newPassword
                User.findOne({_id: resetPassword.userId }, (error, user) => {
                    if(error || !user){
                        res.render('login', {error: "Error Finding User"})
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