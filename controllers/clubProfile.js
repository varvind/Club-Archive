const Club = require('../models/Club')
const User = require('../models/User')
const PopClub = require('../models/PopularClubs')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id)
    const user = await User.findById(req.session.userId)
    
    //can access profile settings
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(user._id) == String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }
   
    //update and add to searches
    var found = false;
    for(var i =0; i < searches.length; i++) {
        if(String(searches[i]._id) == String(club._id)) { //update searches
            found = true;
            searches[i] = club
            break;
        }
    }
   if(!found) {searches.push(club)}
   req.session.searches=searches

   //able to apply as an admin (must already be a member and not already applied)
   let ableToApplyAdmin = false;
   if(user != null){
        let currentMember = false
        club.members.forEach(mem => { //must be a member in order to apply for admin
            if(String(mem.id) == String(user._id)){
                currentMember = true
            }
        })
        if(currentMember){
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

    //able to apply as member
    let ableToApplyMember = false
    let alreadyAppliedMember = false
    let alreadyMember = false
    if(user != null){
        club.member_applications.forEach(user_app => { //have they already applied for membership
            if(String(user_app.userId) == String(user._id)){
                alreadyAppliedMember = true;
            }
        });
    
        club.members.forEach(mem => { //are they already a member
            if(String(mem.id) == String(user._id)){
                alreadyMember = true
            }
        })
    }
    if(!alreadyAppliedMember && !alreadyMember){ableToApplyMember = true}

    //member and user rating
    let user_rating = 0
    let user_message = null
    if(user){
        club.ratings.global.users.forEach(rat => {
            if(rat.userId == String(user._id)){
                user_rating = Number(rat.rating)
                user_message = rat.message
            }
        });
    }
    let global_average = club.ratings.global.total / club.ratings.global.count
    let member_average = club.ratings.members.total / club.ratings.members.count
    let club_rating = {currentRat: user_rating, currentMes: user_message, global_average, member_average}

    //analytics- club porfile visits (for popular clubs)
    let difference = new Date() - club.counter.shiftDate
    const milsPerDay = 86400000
    let daysSinceLastShift = ~~(difference/milsPerDay)
    if(daysSinceLastShift != 0){
        for(let i=0; i<daysSinceLastShift; i++){
            club.counter.array.unshift(0)
        }
        club.counter.array.splice(365,club.counter.array.length - 365)
        club.counter.shiftDate = new Date()

        club.counter.markModified('array')
    }
    club.counter.array[0] += 1
    club.markModified('counter.array')
    club.save()

    let totalVisits = 0
    i = 0
    club.counter.array.forEach(count => { //count total visits in the last 30 days
        if(i<31){totalVisits += count}
        i += 1
    });
    //console.log(`Total Visits: ${totalVisits}`)

    let rating_avg = null
    if(club.ratings.global.count != 0){
        rating_avg = club.ratings.global.total / club.ratings.global.count 
        if(club.ratings.members.count != 0){
            rating_avg += (club.ratings.members.total / club.ratings.members.count)
            rating_avg = rating_avg / 2
        }
    }
    //console.log(`Average rating: ${rating_avg}`)

    let popList = await PopClub.findOne({}, async (err, found) => {
        if(err || !found){console.log(err || "Not Found")}
        else{
            let alreadyIncluded = false
            found.topClubs.forEach(popular => {
                if(String(popular.club._id) == String(club._id)){
                    alreadyIncluded = true 

                    popular.club = club
                    popular.counter = totalVisits
                    popular.rating = rating_avg
                    found.markModified('topClubs')
                }
            });
            

            new_pop = {
                club: club,
                counter: totalVisits,
                rating: rating_avg,
            }
            if(!alreadyIncluded){
                if(found.topClubs.length < 15){
                    found.topClubs.push(new_pop)
                }else{
                    //scaling the counters to values 0-1
                    let bigger_count = (found.topClubs[14].counter > new_pop.counter) ? found.topClubs[14].counter : new_pop.counter

                    //last member of popular list is "that"
                    let that_score = found.topClubs[14].counter/bigger_count
                    if(found.topClubs[14].rating){
                        that_score = (that_score*.7) + ((found.topClubs[14].rating/5)*.3)
                    }else{//if no rating present assume rating of 3
                        that_score = (that_score*.7) + ((3/5)*.3)
                    }

                    //new_pop corresponds to "this" club
                    let this_score = new_pop.counter/bigger_count
                    if(new_pop.rating){
                        this_score = (this_score*.7) + ((new_pop.rating/5)*.3)
                    }else{ //if no rating present assume rating of 3
                        this_score = (that_score*.7) + ((3/5)*.3)
                    }

                    if(this_score > that_score){
                        found.topClubs[14] = new_pop
                    }
                }
            }
            found.save()
        }
    })

    res.render('clubProfile' ,{
        club,
        user,
        canEdit,
        ableToApplyMember,
        ableToApplyAdmin,
        club_rating,
        layout:'layouts/topMenuBar'
    })
}