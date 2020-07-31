const Club = require('../../../../../models/Club')
const User = require('../../../../../models/User')
const mongoose = require('mongoose')

module.exports = async (req, res)=> {    
    var gfs = global.gfs
    const club = await Club.findById(req.params.club_id, async (err, found) => {
        if(err || !found){
            console.log('Error Finding Club')
            res.redirect('/')
        }else{
            const user = await User.findById(req.session.userId)
            const settings_message = {User: user.firstName + " " + user.lastName, Type: `Removed Image from Club Profile`, Date: date, Time: time}
            club.settings_history.unshift(settings_message)
            //delete given image
            gfs.remove({filename: String(req.params.filename), root: 'uploads'}, (err) => {
                if(err){
                    console.log("Issue with deleting club image")
                    res.redirect('/')
                }else{
                    console.log("Successfully deleted club image")
                }
            })

            let i = 0
            found.images.forEach(image => {
                if(image == req.params.filename){
                    found.images.splice(i,1)
                    found.save()
                }
                i += 1
            });

            res.redirect(`/clubsettings/${found._id}`)
        }
    })
}