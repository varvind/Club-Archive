const User = require('../../../../models/User')
const ResetPassword = require('../../../../models/ResetPassword')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config()

const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

module.exports = async (req, res) => {
    const email = req.body.email

    await User.findOne( {email : email}, async (err, user) => {
        if(!user){ //if no user with requested email found
            console.log('No user found with that email address.')
            res.redirect('/forgotpassword')
            //need to make an error
        }
        else{ //user found
            await ResetPassword.findOne({userId : user._id}, async (err, oldpassword) => { //delete old reset password
                if(oldpassword){
                    oldpassword.remove()
                }
            })
            var token = crypto.randomBytes(16).toString('hex')
            var resetToken = new ResetPassword({
                userId: user._id,
                resetPasswordToken: token
            })
            //console.log(resetToken)
        
            await ResetPassword.create(resetToken, async (err) =>{ //create new reset password
                if(err){
                    console.log("Error Creating Reset Password Schema")
                    res.redirect('/forgotpassword')
                }else{
                    // create reusable transporter object using the default SMTP transport
                    const oauth2Client = new OAuth2(
                        process.env.CLIENT_ID, // ClientID
                        process.env.CLIENT_SECRET, // Client Secret
                        "https://developers.google.com/oauthplayground" // Redirect URL
                   );

                    oauth2Client.setCredentials({
                        refresh_token: process.env.REFRESH_TOKEN
                    });
                    const accessToken = oauth2Client.getAccessToken()
                    
                    const transporter = await nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            type: "OAuth2",
                            user: process.env.EMAIL, 
                            clientId: process.env.CLIENT_ID,
                            clientSecret: process.env.CLIENT_SECRET,
                            refreshToken: process.env.REFRESH_TOKEN,
                            accessToken: accessToken
                        }
                    })
                    
                    await transporter.verify(function(error, success) {
                        if (error) {
                                console.log(error);
                                res.redirect('/forgotpassword')
                        } else {
                                console.log('Server is ready to send email');
                        }
                    })

                    var mailOptions = {
                        to: user.email,
                        from: process.env.EMAIL,
                        subject: 'Reset your ClubArchive Password',
                        messageId: 'Rest Password',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your ClubArchive profile.\n\n' +
                        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                        'https://www.clubarchive.com/userReset?resetId=' + resetToken.resetPasswordToken + '\n\n' +
                        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    }

                    await transporter.sendMail(mailOptions, (errr,info) =>{
                        if(errr){
                            console.log(errr)
                            res.redirect('/forgotpassword')
                        }else{
                            console.log("Successful sent reset password token")
                            res.redirect('/')
                        }
                    })
                }
            })
        }
    })
}