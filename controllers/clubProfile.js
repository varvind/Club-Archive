const Club = require('../models/Club')
const User = require('../models/User')
module.exports = async (req, res) => {

    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(user._id) == String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }
   
    var found = false;
   for(var i =0; i < searches.length; i++) {
        if(String(searches[i]._id) == String(club._id)) {
            found = true;
            searches[i] = club
            break;
        }
   }
   if(found == false) {
       searches.push(club)
   }

   //for each if already applied to admin
   let ableToApplyAdmin = false;
   if(user != null){
        let currentMember = false
        club.members.forEach(mem => { //must be a member in order to apply for admin
            if(String(mem.id) == String(user._id)){
                currentMember = true
            }
        })
        if(currentMember){
            console.log("Current Member")
            let appliedAdmin = false
            club.admin_applications.forEach(admin_app => { //already applied for admin position
                if(String(admin_app.userId) == String(user._id)){
                    appliedAdmin = true;
                }
            })
            if(!appliedAdmin){
                ableToApplyAdmin = true
            }
            
            club.adminstrators.forEach(admin => {
                if(String(admin.id) == String(user._id)){
                    ableToApplyAdmin = false
                }
            })
        }
   }

    let ableToApplyMember = false
    let alreadyAppliedMember = false
    let alreadyMember = false
    if(user != null){
        club.member_applications.forEach(user_app => {
            if(String(user_app.userId) == String(user._id)){
                alreadyAppliedMember = true;
            }
        });
    
        club.members.forEach(mem => {
            if(String(mem.id) == String(user._id)){
                alreadyMember = true
            }
        })
    }
    if(!alreadyAppliedMember && !alreadyMember){ableToApplyMember = true}

    //console.log(searches)
    req.session.searches=searches

    res.render('clubProfile' ,{
        club,
        user,
        canEdit,
        ableToApplyMember,
        ableToApplyAdmin
    })
    
}