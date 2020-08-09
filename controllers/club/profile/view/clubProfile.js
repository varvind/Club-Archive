const Club = require('../../../../models/Club')
const User = require('../../../../models/User')
const PopClub = require('../../../../models/PopularClubs')
const { access } = require('fs')

module.exports = async (req, res) => {
    const club = await Club.findById(req.params.id, async (err, club) => {
        if (err || !club) { console.log(err || "Club not found")}
        else {
            const user = await User.findById(req.session.userId, async (error, user) => {
            if(error){console.log(error)}
            else{
                const canEdit = await authenticateUser(user, club)

                let ableToApplyAdmin = false;
                if(user != null){
                    
                    ableToApplyAdmin = await canApplyForAdmin(user, club);

                    await updateUserPopulerTags(user, club)
                    // user analytics
                    
                    await updateRecentSearch(user, club)
                    
                    user.save()
                }

                //able to apply as member
                let ableToApplyMember =  await canApplyForMember(user, club)
                

                //member and user rating
                let club_rating = await updateRatings(user, club)

                //analytics- club porfile visits (for popular clubs)
                await updateMonthlyPopularClubs(club);
                club.save()

                await updatePopularClubsSchema(club)

                res.render('club_views/profile/clubProfile', {
                    club,
                    user,
                    canEdit,
                    ableToApplyMember,
                    ableToApplyAdmin,
                    club_rating,
                    layout:'layouts/topMenuBar'
                })
            }
        })
        }
    })
}

async function authenticateUser(user, club) {
    var canEdit = false;
    if(user != null){
        for(var i = 0; i < club.adminstrators.length; i++){
            if(String(user._id) == String(club.adminstrators[i].id) ){
                canEdit = true
            }
        }
    }
    return canEdit;
}

async function canApplyForAdmin(user, club) {
    let currentMember = false
    let ableToApplyAdmin = false;
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
    return ableToApplyAdmin;
}

async function updateUserPopulerTags(user, club) {
    club.tags.forEach(tag => {
        var found = false;
        var oldestCandidateForDeleteIndex = 0;
        //found a match and update the dictionary by 1
        for (var i = 0; i < user.popular_tags.length; i++) {
            if(user.popular_tags[i].name == tag) {
                const milsPerDay = 86400000
                var difference = new Date() - user.popular_tags[i].last_updated
                var daysSinceLastUpdated = ~~(difference/milsPerDay)
                
                const milsPerHour = 1000
                const recent_view_object = user.recent_search.filter((a) => String(a.id) == String(club._id))[0]
                var minutesSinceLastUpdated = 0
                if(recent_view_object != undefined) {
                    var recent_view = new Date(recent_view_object.last_viewed)
                    difference = new Date().getTime() - recent_view.getTime()
                    minutesSinceLastUpdated = ~~(difference / (1000 * 60))
                } else {
                    minutesSinceLastUpdated = 30
                }
                
                if(daysSinceLastUpdated < 90 && minutesSinceLastUpdated >= 30) {
                    user.popular_tags[i].count += 1;
                    user.popular_tags[i].last_updated = new Date()
                } else if (daysSinceLastUpdated >= 90) {
                    user.popular_tags.splice(i, 1)
                    var popular_tag_object = {name : tag, count : 1, last_updated: new Date()}
                    user.popular_tags.push(popular_tag_object)
                }
                found = true;
            } else if (user.popular_tags[i].count < user.popular_tags[oldestCandidateForDeleteIndex].count){
                oldestCandidateForDeleteIndex = i;
            }
        }
        if (!found) { 
            var popular_tag_object = {name : tag, count : 1, last_updated: new Date()}
            if(user.popular_tags.length < 10) {
                user.popular_tags.push(popular_tag_object)
            } else {
                user.popular_tags.splice(oldestCandidateForDeleteIndex, 1)
                user.popular_tags.push(popular_tag_object)
            }
            
        } 
    })
    user.popular_tags.sort((a, b) => b.count - a.count)
    user.markModified('popular_tags')
}

async function updateRecentSearch(user, club) {
    var recent_view = {id:club._id ,name: club.name, description : club.description, last_viewed : new Date()}
    user.recent_search.unshift(recent_view)
    for(var i = 1; i < user.recent_search.length; i++) {
        if(String(user.recent_search[i].id) == String(club._id)) {
            user.recent_search.splice(i, 1);
            break;
        }
    }
    user.markModified('recent_search')
}

async function canApplyForMember(user, club) {
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
    if(!alreadyAppliedMember && !alreadyMember){ 
        ableToApplyMember = true
    }
    return ableToApplyMember
}

async function updateRatings(user, club) {
    let user_rating = 0
    let user_message = null
    let anonymous = false
    if (user) {
        club.ratings.global.users.forEach(rat => {
            if(rat.userId == String(user._id)){
                user_rating = Number(rat.rating)
                user_message = rat.message
                anonymous = rat.anonymous
            }
        });
    }
    let global_average = club.ratings.global.total / club.ratings.global.count
    let member_average = club.ratings.members.total / club.ratings.members.count
    let club_rating = {currentRat: user_rating, currentMes: user_message, currentAnon: anonymous, global_average, member_average}

    return club_rating
}

async function updateMonthlyPopularClubs(club) {
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
}

async function updatePopularClubsSchema(club) {
    let totalVisits = 0
    i = 0
    club.counter.array.forEach(count => { //count total visits in the last 30 days
        if(i<31){totalVisits += count}
        i += 1
    });

    let rating_avg = null
    if(club.ratings.global.count != 0){
        rating_avg = club.ratings.global.total / club.ratings.global.count 
        if(club.ratings.members.count != 0){
            rating_avg += (club.ratings.members.total / club.ratings.members.count)
            rating_avg = rating_avg / 2
        }
    }

    await PopClub.findOne({}, async (err, found) => {
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
}