const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId, async function(err){
        if(err){
            console.log("User not logged in")
            res.redirect('/')
        }else{
            const club = await Club.findById(req.params.clubId, (error, found) => {
                if(error || !found){
                    console.log("Error finding club to rate")
                    res.redirect('/')
                }else{
                    let member = false
                    found.members.forEach(mem => {
                        if(mem.id == req.session.userId) {member = true}
                    });
                    
                    let newUser = true
                    let new_rating = {userId: req.session.userId, rating: req.body.rating, message: req.body.message || ""}
                    
                    found.ratings.global.users.forEach(user_rating => {
                        if(user_rating.userId == req.session.userId){
                            let global_difference = Number(req.body.rating) - user_rating.rating
                            found.ratings.global.total += global_difference

                            user_rating.rating = req.body.rating
                            user_rating.message = req.body.message
                            found.markModified('ratings')
                            found.save()

                            if(member){
                                found.ratings.members.users.forEach(mem => {
                                    if(mem.userId == req.session.userId){
                                        let member_difference = Number(req.body.rating) - mem.rating
                                        found.ratings.members.total += member_difference

                                        mem.rating = req.body.rating
                                        mem.message = req.body.message
                                        found.markModified('ratings')
                                        found.save()
                                    }
                                });
                            }

                            newUser = false
                        }
                    });

                    if(newUser){
                        found.ratings.global.users.push(new_rating)
                        found.ratings.global.total += Number(req.body.rating)
                        found.ratings.global.count += 1

                        if(member){
                            found.ratings.members.users.push(new_rating)
                            found.ratings.members.total += Number(req.body.rating)
                            found.ratings.members.count += 1
                        }

                        found.save()
                    }
                }
                setTimeout(()=>{
                    res.redirect(`/post/${found._id}`)
                }, 1000)
            });
        }
    });
}