const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../index')
const describe = require('mocha').describe
const before = require('mocha').before
const after = require('mocha').after
const it = require('mocha').it
const User = require('../../../../models/User')
const searchLandingController = require('../../../../controllers/search/view/searchLanding')

describe('Search Landing View Tests', function () {
  before((done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        done()
      }).catch((err) => done(err))
  })

  it('Test Search Landing View', (done) => {
    searchLandingController.testMode()
    request(app).get('/searchLanding')
      .then((res) => {
        expect(res.statusCode).to.equal(200)
        done()
      }).catch((err) => done(err))
  })

  after((done) => {
    User.deleteOne({ userName: '0' }, function (err, obj) {
      if (err) {
        console.log(err)
      }
      done()
    })
  })
})
