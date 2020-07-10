const User = require('../models/User')
const ResetPassword = require('../models/ResetPassword')
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config()
const path = require('path')
module.exports = (req, res) => {
    const email = req.body.email

    User.findOne( {email : email}, (err, user) => {
        if(!user){ //if no user with requested email found
            console.log('No user found with that email address.')
            //need to make an error
        }
        else{ //user found
            ResetPassword.findOne({userId : user._id}, (err, oldpassword) => { //delete old reset password
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
        
            ResetPassword.create(resetToken, (err) =>{ //create new reset password
                if(err){
                    console.log("Error Creating Reset Password Schema")
                }else{
                    nodemailer.createTestAccount((err, account) => {
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true, // true for 465, false for other ports
                            auth: {
                                user: process.env.EMAIL, // generated ethereal user
                                pass: process.env.PASSWORD  // generated ethereal password
                            }
                        })
                        transporter.verify(function(error, success) {
                            if (error) {
                                 console.log(error);
                            } else {
                                 console.log('Server is ready to send email');
                            }
                         })

                        var mailOptions = {
                            to: user.email,
                            from: "quentinromanoski@gmail.com",
                            subject: 'Reset your ClubArchive Password',
                            messageId: 'Rest Password',
                            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your ClubArchive profile.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://localhost:3000/userReset?resetId=' + resetToken.resetPasswordToken + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        }

                        transporter.sendMail(mailOptions, (errr,info) =>{
                            if(errr){
                                console.log(err)
                            }else{
                                console.log(nodemailer.getTestMessageUrl(info))
                            }
                        })
                    })
                }
            })
        }
    })

    res.redirect('/')
}