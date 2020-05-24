const Club = require('../models/Club')
const path = require('path')
const User = require('../models/User')

module.exports = async (req, res) => {
    var name = req.body.name
    var members = req.body.memberCount
    var president = req.body.president_organizer
    var email = req.body.email
    var phone = req.body.phonenumber
    var description = req.body.description
    var meetings = req.body.meeting_times
    var category = req.body.category
    var reg_season = req.body.registration_season
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
            if(reg_season !=""){
                club.registration_season = reg_season
            }
            club.save()
            
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
                    if(reg_season !=""){
                        club.registration_season = reg_season
                    }
                    club.image = '/public/img/' + image.name;
                    club.save();
                })
                const club = Club.findById(req.params._id)
                // User.findById(req.session.userId, (error, user)=> {
                //     for(var i =0; i < user.clubs.length; i++){
                //         if(String(user.clubs[i]._id) == String(club._id)){
                //             user.clubs[i] = club;
                //             user.save();
                //             break;
                //         }
                //     }
                // })
                res.redirect('/post/' + req.params.id)

            }
            
        })
    }
}