const Club = require('../models/Club')
const User = require('../models/User')
const path = require('path')
module.exports = async (req, res) => {
    if(!req.file){
        res.render('clubSignUp',  { error:"error" })
    }
    else {
            await Club.create({
                ...req.body,
                image: req.file.filename
            }, async function(error, newlymade) {
                if(error){
                    console.log("hello")
                    console.log(error)
                    res.render('clubSignUp', { error: error})
                }
                else {
                    User.findById(req.session.userId, (err, user) => {
                        user.clubs.push(newlymade._id)
                        user.save()

                        admin = {name : user.firstName + " " + user.lastName, id: user._id}
                        newlymade.adminstrators.push(admin)
                        member = {name : user.firstName + " " + user.lastName, id: user._id}
                        newlymade.members.push(member)
                        newlymade.save()
                    })
                    
                    res.redirect('/')
                }
            })            
    }
}