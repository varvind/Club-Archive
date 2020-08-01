const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../../index')
describe('POST /addUser', function () {
    this.timeout(10000)
    before((done) => {
        const Mockgoose = require('mockgoose').Mockgoose
        const mockgoose = new Mockgoose(mongoose)
        mockgoose.prepareStorage()
            .then(()=> {
                mongoose.Promise = global.Promise;
                mongoose.connect("mongodb://localhost/club_archive")
            })
        .then(() => done())
        .catch((err) => done(err))
    })

    it('Test Successful Sign Up', (done) => {
        this.timeout(10000)
        setTimeout(done, 300)
        request(app).post('/addUser').send({firstName: 'test', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            expect(res.header.location).to.equal('/')
        }).catch((err) => done(err))
    }).timeout(10000)

    it('Test Unsuccessful Sign Up', (done) => {
        this.timeout(10000)
        setTimeout(done, 300)
        request(app).post('/addUser').send({firstName: '', lastName:'user', email : 'test@email.com', userName: "0",  password:'0', confirm_password: '0', major: 'comp sci', gradYear:'2020', image:''})
        .then((res) => {
            expect(res.header.location).to.not.equal('/')
        }).catch((err) => done(err))
    }).timeout(10000)


    

})