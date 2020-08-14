const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const User = require('../../../../../models/User')


describe('Logout User Tests', function () {

    before((done) => {
        request(app).post('/addUser').send({firstName: 'test', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            done()
        }).catch((err) => done(err))
    })

    it('Test Successful Logout', (done) => {
        request(app).get('/userlogout')
        .then((res) => {
            expect(res.header.location).to.equal('/')
            expect(res.statusCode).to.equal(302)
            done()
        }).catch((err) => done(err))
    })

    after((done) => {
        User.deleteOne({userName: "0"}, function(err, obj) {
            done()
        })
    })
    

})