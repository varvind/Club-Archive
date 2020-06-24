const ResetPassword = require('../models/ResetPassword')

module.exports = (req, res) => {
    if(req.query.resetId == null){
        res.render('userReset', {error: "No Reset ID"})
    }
    ResetPassword.findOne({resetPasswordToken: req.query.resetId}, (error, resetPassword) => {
        if(!resetPassword){
            res.render('login', {error: "Reset Token not Found or Expired", layout:false})
        }else{
            res.render('userReset', 
            {
                error: null,
                resetId: req.query.resetId,
                layout:false
            })
        }
    })  
}