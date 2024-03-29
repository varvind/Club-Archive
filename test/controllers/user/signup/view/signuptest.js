const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const describe = require('mocha').describe
const it = require('mocha').it

describe('POST /addUser', function () {
  it('Test Successful View Request', (done) => {
    request(app).get('/signup').then((res) => {
      expect(res.statusCode).to.equal(200)
      done()
    }).catch((err) => done(err))
  })
})
