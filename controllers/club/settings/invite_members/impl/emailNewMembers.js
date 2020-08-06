const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const InviteToken = require('../../../../../models/InviteMemberToken')

const nodemailer = require('nodemailer')
const crypto = require('crypto')

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require('dotenv').config()

module.exports = async (req, res) => {
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
    await Club.findById(req.params.club_id, async (err, club) => {
        if(err || !club){
            console.log(err || "Club Not Found")
            res.redirect('/')
        }else{
            await User.findById(req.session.userId, async (errr, user) => {
                
                if(errr || !user){
                    console.log(errr || "User Not Found")
                    res.redirect('/login')
                }else{
                    let canEdit = false
                    club.adminstrators.forEach(admin => {
                        if(String(admin.id) == user._id){
                            canEdit = true
                        }
                    })
                    if(!canEdit){
                        console.log("User does not have access to these settings")
                        res.redirect(`/post/${club._id}`)
                    }else{
                        const settings_message = {User: user.firstName + " " + user.lastName, Type: `Invited user via email to join club`, Date: date, Time: time}
                        club.settings_history.unshift(settings_message)
                        club.save()
                        
                        const oauth2Client = new OAuth2(
                            process.env.CLIENTID, // ClientID
                            process.env.CLIENTSECRET, // Client Secret
                            "https://developers.google.com/oauthplayground" // Redirect URL
                       );

                        oauth2Client.setCredentials({
                        refresh_token: process.env.REFRESHTOKEN
                        });
                        const accessToken = oauth2Client.getAccessToken()
                        
                        const transporter = await nodemailer.createTransport({
                            service: "gmail",
                            auth: {
                                type: "OAuth2",
                                user: process.env.EMAIL, 
                                clientId: process.env.CLIENTID,
                                clientSecret: process.env.CLIENTSECRET,
                                refreshToken: process.env.REFRESHTOKEN,
                                accessToken: accessToken
                            }
                        })
                            
                        await transporter.verify(async function(error){
                            if(error){
                                    console.log(error);
                                    res.redirect('/')
                            }else{
                                //console.log('Server is ready to send email');

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
                                                    text: `${club.name} has invited you to join their organization on ClubArchive. \nClick this link in order to create an account or simply login into your existing account. https://www.clubarchive.com/login \nNext, click this link in order to join ${club.name} as a ${req.body[admin]}. https://clubarchive.com/${club._id}/joinclub/ \n When prompted enter this token: ${token}`
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
                                smtpTransport.close();
                            }
                        })
                    }
                }
            })
        }
    })
}