const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const User = require('../../../../../models/User')


describe('Login User Tests', function () {

    before((done) => {
        request(app).post('/addUser').send({firstName: 'test', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            done()
        }).catch((err) => done(err))
    })

    it('Test Successful Login', (done) => {
        request(app).post('/userlogin').send({userName: "0", password: "0"})
        .then((res) => {
            expect(res.header.location).to.equal('/')
            expect(res.statusCode).to.equal(302)
            done()
        }).catch((err) => done(err))
    })

    it('Test Unsuccessful Login', (done) => {
        request(app).post('/userlogin').send({userName: "0", password: "1"})
        .then((res) => {
            expect(res.statusCode).to.equal(200)
            done()
        }).catch((err) => done(err))
    })

    it('Test User not found', (done) => {
        request(app).post('/userlogin').send({userName: null, password: "2"})
        .then((res) => {
            expect(res.statusCode).to.equal(200)
            done()
        }).catch((err) => done(err))
    })
    

    after((done) => {
        User.deleteOne({userName: "0"}, function(err, obj) {
            done()
        })
    })
    

})