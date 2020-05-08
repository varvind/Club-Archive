const Club = require('../models/Club')
const path = require('path')
const User = require('../models/User')

module.exports = async (req, res) => {
    const user = User.findById(req.session.userId)
    var name = req.body.name
    var members = req.body.memberCount
    var president = req.body.president_organizer
    var email = req.body.email
    var phone = req.body.phonenumber
    var description = req.body.description
    var meetings = req.body.meeting_times
    var category = req.body.category
    if(!req.files){
        Club.findById(req.params.id, (error, club) =>{
            if(name != ""){
                club.name = name;
            }
            if(members != ""){
                club.memberCount = members
            }
            if(president!= ""){
                club.president_organizer = president
            }
            if(email != ""){
                club.email = email
            }
            if(phone != ""){
                club.phonenumber = phone
            }
            if(description !="" ){
                club.description = description
            }
            if(meetings != ""){
                club.meeting_times = meetings
            }
            if(category!= ""){
                club.category = category
            }
            club.save()
            User.findById(req.session.userId, (error, user)=> {
                for(var i =0; i < user.clubs.length; i++){
                    if(String(user.clubs[i]._id) == String(club._id)){
                        user.clubs[i] = club;
                    }
                }
            })
        })
        res.redirect('/post/' + req.params.id)
    }
    else{
        let image = req.files.image
        image.mv(path.resolve(__dirname, '..','public/img',image.name), async (error) =>{
            if(error) {
                console.log("error while updating club")
                res.redirect('/clubSettings/' + req.params.id)
            }
            else{
                Club.findById(req.params.id, (error, club)=> {
                    if(name != ""){
                        club.name = name;
                    }
                    if(members != ""){
                        club.memberCount = members
                    }
                    if(president!= ""){
                        club.president_organizer = president
                    }
                    if(email != ""){
                        club.email = email
                    }
                    if(phone != ""){
                        club.phonenumber = phone
                    }
                    if(description !="" ){
                        club.description = description
                    }
                    if(meetings != ""){
                        club.meeting_times = meetings
                    }
                    if(category!= ""){
                        club.category = category
                    }
                    club.image = '/public/img/' + image.name;
                    club.save();
                    User.findById(req.session.userId, (error, user)=> {
                        for(var i =0; i < user.clubs.length; i++){
                            if(String(user.clubs[i]._id) == String(club._id)){
                                user.clubs[i] = club;
                            }
                        }
                    })
                })
                res.redirect('/post/' + req.params.id)

            }
            
        })
    }
}