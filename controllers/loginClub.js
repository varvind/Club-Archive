const bcrypt = require('bcrypt')

const Club = require('../models/Club')



module.exports = (req, res) => {
    const {userName, password} = req.body;
    Club.findOne({userName:userName} , (error, club) => {
        if(club) {
            bcrypt.compare(password, club.password, (error, same) => {
                if(same) {
                    req.session.clubId = club._id
                    res.redirect('/')
                }
                else {
                    res.redirect('/clublogin')
                }
            })
        }
        else {
            res.redirect('/clublogin')
        }
    })
}