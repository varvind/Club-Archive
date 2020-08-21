const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const describe = require('mocha').describe
const it = require('mocha').it

describe('Login View Tests', function () {
  it('Test Login View', (done) => {
    request(app).get('/login')
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      }).catch((err) => done(err))
  })
})
