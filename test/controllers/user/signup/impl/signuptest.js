const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const User = require('../../../../../models/User')
const describe = require('mocha').describe
const before = require('mocha').before
const after = require('mocha').after
const it = require('mocha').it

describe('POST /addUser', function () {
  before((done) => {
    User.deleteOne({ userName: '0' }, function (err, obj) {
      if (err) {
        console.log(err)
      }
      done()
    })
  })

  it('Test Successful Sign Up', (done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        expect(res.header.location).to.equal('/')
        done()
      }).catch((err) => done(err))
  })

  it('Test Unsuccessful Sign Up', (done) => {
    request(app).post('/addUser').send({ firstName: '', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        expect(res.header.location).to.not.equal('/')
        done()
      }).catch((err) => done(err))
  })

  it('Test Confirm Password does not match Password', (done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '2', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        expect(res.header.location).to.not.equal('/')
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
