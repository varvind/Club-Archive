const User = require('../models/User')
const Club = require('../models/Club')
const PopClub = require('../models/PopularClubs')


module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId)
    //console.log(req.session)

    let popList
    while(!popList){
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

    popList.topClubs.sort((b,a) => a.counter - b.counter)
    popList.markModified('topClubs')
    popList.save()

    let popular = {}
    if(popList.topClubs){ popular= popList.topClubs }

    res.render('index', {
        user,
        layout: false,
        popular
    })
}