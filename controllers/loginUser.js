const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = (req, res) => {
    const {userName, password} = req.body;
    console.log(userName)
    User.findOne({userName:userName}, (error, user) => {
        console.log(user)
        if(user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if(same) {
                    req.session.userId = user._id
                    res.redirect('/')
                    
                }
                else {
                    res.redirect('/login')
                }
            })
        }
        else {
            res.redirect('/login')
        }
    })
}