const Club = require('../models/Club')
const User = require('../models/User')
const path = require('path')
module.exports = (req, res) => {
    if(!req.files){
        res.render('clubSignUp',  { error:"error" })
    }
    else {
        let image = req.files.image;
        let imageName = Date.now() + '-' + image.name
    
        console.log(path.resolve(__dirname,'..'))

        image.mv(path.resolve(__dirname, '..', 'public', 'club-images', imageName), async (error) => {
            if(error){
                console.log("Error making image")
            }
            await Club.create({
                ...req.body,
                image: path.resolve(__dirname, '..', '/', 'public', 'club-images', imageName)
            }, async function(error, newlymade) {
                if(error){
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
        })
    }
}