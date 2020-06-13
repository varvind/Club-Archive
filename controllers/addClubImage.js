const Club = require('../models/Club')


module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)

    if(!req.file){
        res.redirect('/clubsettings/'+ club._id)
    } else {
        if(req.file.mimetype == "image/jpeg" || req.file.mimetype == "image/png"){
            club.images.push(req.file.filename);
            club.save();
        }
        res.redirect('/clubsettings/'+ club._id)
    }
}