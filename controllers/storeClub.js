const Club = require('../models/Club')
const path = require('path')
const multer = require('multer')

module.exports = (req, res) => {
    const newClub = new Club({
        name: req.body.name,
        memberCount: req.body.memberCount,
        president_organizer: req.body.president_organizer,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        description: req.body.description,
        username: req.body.username,
        password: req.body.password,
        category: req.body.category,
        meeting_times: req.body.meeting_times,
    })
    for(i=0; i<req.files.length; i++){
        newClub.clubImages.push(req.files[i].path)
    }
    newClub.save()
    
    res.redirect('/')
}