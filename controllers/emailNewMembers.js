const User = require('../models/User')
const Club = require('../models/Club')
const InviteToken = require('../models/InviteMemberToken')

const nodemailer = require('nodemailer')
const crypto = require('crypto')
require('dotenv').config()

module.exports = async (req, res) => {
    await Club.findById(req.params.club_id, async (err, club) => {
        if(err || !club){
            console.log(err || "Club Not Found")
            res.redirect('/')
        }else{
            await User.findById(req.session.userId, async (errr, user) => {
                if(errr || !user){
                    console.log(errr || "User Not Found")
                    res.redirect('/')
                }else{
                    let canEdit = false
                    club.adminstrators.forEach(admin => {
                        if(String(admin.id) == user._id){
                            canEdit = true
                        }
                    })
                    if(!canEdit){
                        console.log("User does not have access to these settings")
                        res.redirect('/')
                    }else{
                        const transporter = await nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.EMAIL, 
                                pass: process.env.PASSWORD  
                            }
                        })
                            
                        await transporter.verify(async function(error){
                            if(error){
                                    console.log(error);
                                    res.redirect('/')
                            }else{
                                console.log('Server is ready to send email');

                                for(let i=1; i<=150; i++){
                                    let email = "email"+i
                                    let admin = "position"+i

                                    if(!req.body[email]){
                                        break
                                    }else{
                                        let isAdmin = false
                                        if(req.body[admin] == "admin"){isAdmin = true}

                                        let token = crypto.randomBytes(16).toString('hex')
                                        let inviteToken = new InviteToken({
                                            clubId: club._id,
                                            isAdmin: isAdmin,
                                            token: token
                                        })

                                        await InviteToken.create(inviteToken,async (err, createdToken) => {
                                            if(err || !createdToken){
                                                console.log("Error creating invite token schema")
                                                res.redirect('/')
                                            }else{
                                                let subject = club.name + " has invited you to join their organization"
                                                var mailOptions = {
                                                    to: req.body[email],
                                                    from: process.env.EMAIL,
                                                    subject: subject,
                                                    messageId: 'Invite Token',
                                                    text: inviteToken.toString()
                                                }
                    
                                                await transporter.sendMail(mailOptions, (errr,info) =>{
                                                    if(errr){
                                                        console.log('Error sending mail')
                                                        res.redirect('/')
                                                    }else{
                                                        console.log("Successfully sent mail")
                                                        res.redirect(`/clubSettings/${club._id}`)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }
                }
            })
        }
    })
}