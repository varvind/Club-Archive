const expect = require('chai').expect
const request = require('supertest')
const mongoose = require('mongoose')
const app = require('../../../../../index')
const Mockgoose = require('mockgoose').Mockgoose
const mockgoose = new Mockgoose(mongoose)
describe('POST /addUser', function () {
    this.timeout(120000)

    it('Test View Request', (done) => {
        request(app).get('/signup').then((res) => {
            expect(res.statusCode).to.equal(200)
            done()
        }).catch((err) => done(err))
    })
})