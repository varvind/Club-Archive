const Club = require('../../../../../models/Club')
const path = require('path')
const User = require('../../../../../models/User')
const fs = require('fs')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    var name = req.body.name
    var members = req.body.memberCount
    var president = req.body.president_organizer
    var email = req.body.email
    var phone = req.body.phonenumber
    var description = req.body.description
    var meetings = req.body.meeting_times
    var category = req.body.category
    var reg_season = req.body.registration_season
    var today = new Date();
    var date = (today.getMonth() + 1) + '-' + today.getDate()+ "-" + today.getFullYear();
    var time = "";
    if(today.getUTCHours() - 5 > 12) {
            time = (today.getUTCHours() - 12 - 5) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 12) {
            time = (today.getUTCHours() - 5 ) + ":" + today.getMinutes() + " pm"
    } else if (today.getUTCHours() - 5 == 0) {
            time = (today.getUTCHours() + 12 - 5) + ":" + today.getMinutes() + " am"
    } else {
            time = (today.getUTCHours() - 5) + ":" + today.getMinutes() + " am"
    }
    if(!req.file){
        Club.findById(req.params.id, (error, club) =>{
            var attributes = "";
            if(name != ""){
                if(club.name != name) {
                    attributes += "name, " 
                } 
                club.name = name; 
            }
            if(members != ""){
                if(club.memberCount != members) {
                    attributes += "member count, " 
                } 
                club.memberCount = members;
            }
            if(president!= ""){ 
                if(club.president_organizer != president) {
                    attributes += "president, " 
                } 
                club.president_organizer = president ; 
            }
            if(email != ""){ 
                if(club.email != email) {
                    attributes += "email, " 
                } 
                club.email = email ;
            }
            if(phone != ""){ 
                if(club.phonenumber != phone) {
                    attributes += "phone number, " 
                } 
                club.phonenumber = phone;
            }
            if(description !="" ){
                if(club.description.trim() != description.trim()) {
                    attributes += "description, " 
                } 
                club.description = description; 
            }
            if(meetings != ""){ 
                if(club.meeting_times != meetings) {
                    attributes += "meeting times, " 
                } 
                club.meeting_times = meetings;
            }
            if(category!= ""){ 
                if(club.category != category) {
                    attributes += "club category, " 
                } 
                club.category = category;
            }
            if(reg_season!=""){
                if(club.registration_season != reg_season) {
                    attributes += "recruiting season, " 
                } 
                club.registration_season = reg_season;
            }
            if(attributes.length > 0) {
                attributes = attributes.substring(0, attributes.length - 2)
                const settings_message = {User: user.firstName + " " + user.lastName, Type: `Updated Club ${attributes}`, Date: date, Time: time}
                club.settings_history.unshift(settings_message)
            }
            club.save()
        })
        res.redirect('/post/' + req.params.id)
    }
    else{
        Club.findById(req.params.id, (error, club)=> {
            var attributes = "";
            if(name != ""){
                if(club.name != name) {
                    attributes += "name, " 
                } 
                club.name = name; 
            }
            if(members != ""){
                if(club.memberCount != members) {
                    attributes += "member count, " 
                } 
                club.memberCount = members;
            }
            if(president!= ""){ 
                if(club.president_organizer != president) {
                    attributes += "president, " 
                } 
                club.president_organizer = president ; 
            }
            if(email != ""){ 
                if(club.email != email) {
                    attributes += "email, " 
                } 
                club.email = email ;
            }
            if(phone != ""){ 
                if(club.phonenumber != phone) {
                    attributes += "phone number, " 
                } 
                club.phonenumber = phone;
            }
            if(description !="" ){ 
                if(club.description.trim() != description.trim()) {
                    attributes += "description, " 
                } 
                club.description = description; 
            }
            if(meetings != ""){ 
                if(club.meeting_times != meetings) {
                    attributes += "meeting times, " 
                } 
                club.meeting_times = meetings;
            }
            if(category!= ""){ 
                if(club.category != category) {
                    attributes += "club category, " 
                } 
                club.category = category;
            }
            if(reg_season!=""){
                if(club.registration_season != reg_season) {
                    attributes += "recruiting season, " 
                } 
                club.registration_season = reg_season;
            }
            club.image = req.file.filename
            attributes += "image, "
            if(attributes.length > 0) {
                attributes = attributes.substring(0, attributes.length - 2)
                const settings_message = {User: user.firstName + " " + user.lastName, Type: `Updated Club ${attributes}`, Date: date, Time: time}
                club.settings_history.unshift(settings_message)
            }
            club.save();
        })
        //const club = Club.findById(req.params._id)
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
}