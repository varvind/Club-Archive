const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../../../index')
const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)
const User = require('../../../../../models/User')
describe('POST /addUser', function () {

    before((done) => {
        User.deleteOne({userName: "0"}, function(err, obj) {
            done()
        })
    })

    it('Test Successful Sign Up', (done) => {

        request(app).post('/addUser').send({firstName: 'test', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            expect(res.header.location).to.equal('/')
            done()
        }).catch((err) => done(err))
    })

    it('Test Unsuccessful Sign Up', (done) => {

        request(app).post('/addUser').send({firstName: '', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            expect(res.header.location).to.not.equal('/')
            done()
        }).catch((err) => done(err))
    })

    it('Test Confirm Password does not match Password', (done) => {
        request(app).post('/addUser').send({firstName: 'test', lastName:'user', email : 'test@email.com', userName: "0",  password:'2', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            expect(res.header.location).to.not.equal('/')
            done()
        }).catch((err) => done(err))
    })    
    

})