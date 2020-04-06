const bcrypt = require('bcrypt')
const User = require('../models/User')
const{check, validationResult} = require('express-validator')
module.exports = (req, res) => {
    const {userName, password} = req.body;
    //console.log(userName)
    User.findOne({userName:userName}, (error, user) => {
        //console.log(user)
        if(user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same) {
                    req.session.userId = user._id
                    res.redirect('/')
                    
                }
                else {
                    error = "Invalid Login"
                    res.render('login', {
                        error: "Invalid Login"
                    })
                    console.log(error)
                }
            })
        }
        else {
            error = "Invalid Login"
            res.render('login', {
                error : "Invalid Login"
            })

            
        }
    })
}