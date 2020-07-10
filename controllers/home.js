const User = require('../models/User')
const Club = require('../models/Club')
const PopClub = require('../models/PopularClubs')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    //console.log(req.session)

    let popList
    if(!popList){
        popList = await PopClub.findOne({}, async (err, found) => {
            if(err){console.log(err)}
            else if(!found){
                await PopClub.create({topClubs: new Array()}, (error, created) => {
                    if(error || !created){console.log("Error created popular club schema")}
                    else{console.log(
                        "Successfully created popular clubs schema")
                    }
                })
            }
        })
    }

    // const milsPerDay = 86400000
    // popList.topClubs.forEach(async popular => {
    //     if((new Date()) - popular.lastUpdated > milsPerDay){
    //         console.log("New update")
    //         await Club.findById(popular.club._id, (err,found) => {
    //             if(err || !found){console.log(err || "Club Not Found")}
    //             else{
                    
    //                 let totCount = 0
    //                 let i = 0
    //                 found.counter.array.forEach(count => {
    //                     if(i<31){totCount += count}
    //                     i += 1
    //                 });

    //                 popular.counter = totCount
    //                 popular.lastUpdated = new Date()
    //                 popular.save()
    //             }
    //         })
    //     }
    // });

    let difference = new Date().valueOf() - popList.lastUpdated.valueOf()
    const milsPerDay = 86400000
    let daysSinceLastUpdate = difference/milsPerDay
    
    if(daysSinceLastUpdate > 0){   //updates twice a day
        popList.topClubs.sort((a,b) => {
            //scaling the counters to values 0-1
            let bigger_count = (b.counter > a.counter) ? b.counter : a.counter

            //last member of popular list is "that"
            let that_score = b.counter/bigger_count
            if(b.rating){
                that_score = (that_score*.7) + ((b.rating/5)*.3)
            }else{//if no rating present assume rating of 3
                that_score = (that_score*.7) + ((3/5)*.3)
            }
            
            //a corresponds to "this" club
            let this_score = a.counter/bigger_count
            if(a.rating){
                this_score = (this_score*.7) + ((a.rating/5)*.3)
            }else{//if no rating present assume rating of 3
                this_score = (that_score*.7) + ((3/5)*.3)
            }
            //console.log(`${a.club.name} has a score of ${this_score}`)
            //console.log(`${b.club.name} has a score of ${that_score}`)

            return that_score-this_score
        })
        popList.markModified('topClubs')
        popList.lastUpdated = new Date()
        popList.save()
    }

    

    let popular = null
    if(popList.topClubs){ popular= popList.topClubs }

    res.render('index', {
        user,
        layout: false,
        popular
    })
}