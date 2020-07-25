const Club = require('../../../../../models/Club')
const mongoose = require('mongoose')

module.exports = async (req, res)=> {    
    var gfs = global.gfs
    const club = await Club.findById(req.params.club_id, (err, found) => {
        if(err || !found){
            console.log('Error Finding Club')
            res.redirect('/')
        }else{
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