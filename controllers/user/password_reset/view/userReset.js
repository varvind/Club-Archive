const ResetPassword = require('../../../../models/ResetPassword')

module.exports = async (req, res) => {
    if(req.query.resetId == null){
        res.render('user_views/settings/userReset', {error: "No Reset ID"})
    }
    await ResetPassword.find({resetPasswordToken: req.query.resetId}, async (error, resetPassword) => {
        if(error || !resetPassword){
            res.render('user_views/login', {error: "Reset Token not Found or Expired", layout:false})
        }else{
            res.render('user_views/settings/userReset', 
            {
                error: null,
                resetId: req.query.resetId,
                layout:false
            })
        }
    })  
}