const User = require('../models/User')
const Club = require('../models/Club')

module.exports = async (req, res) => {
    const user = await User.findById(req.session.userId, async function(err, found_user){
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
                    let new_rating = {userId: req.session.userId, rating: req.body.rating, message: req.body.message.trim() || "", name: "", anonymous: false}
                    if(!req.body.anonymous){
                        new_rating.name = found_user.firstName
                    }else{
                        new_rating.name = "Anonymous"
                        new_rating.anonymous = true
                    }
                    
                    found.ratings.global.users.forEach(user_rating => {
                        if(user_rating.userId == req.session.userId){
                            let global_difference = Number(req.body.rating) - user_rating.rating
                            found.ratings.global.total += global_difference

                            user_rating.rating = req.body.rating
                            user_rating.message = req.body.message.trim()
                            if(!req.body.anonymous){
                                user_rating.name = found_user.firstName
                                user_rating.anonymous = false
                            }else{
                                user_rating.name = "Anonymous"
                                user_rating.anonymous = true
                            }
                            found.markModified('ratings')

                            if(member){
                                found.ratings.members.users.forEach(mem => {
                                    if(mem.userId == req.session.userId){
                                        let member_difference = Number(req.body.rating) - mem.rating
                                        found.ratings.members.total += member_difference

                                        mem.rating = req.body.rating
                                        mem.message = req.body.message.trim()
                                        if(!req.body.anonymous){
                                            mem.name = found_user.firstName
                                            mem.anonymous = false
                                        }else{
                                            mem.name = "Anonymous"
                                            mem.anonymous = true
                                        }
                                        found.markModified('ratings')
                                    }
                                });
                            }
                            found.save()
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