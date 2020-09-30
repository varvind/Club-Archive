const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const User = require('../../../../../models/User')
const describe = require('mocha').describe
const before = require('mocha').before
const after = require('mocha').after
const it = require('mocha').it
const updateUserController = require('../../../../../controllers/user/settings/impl/updateUser')

describe('Update User Tests', function () {
  before((done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        done()
      }).catch((err) => done(err))
  })

  it('Test Successful Update', (done) => {
    updateUserController.testMode()
    request(app).post('/updateuser').send({ firstName: 'newName', lastName : 'newLastName', email : 'newEmail@email.com', userName : '1', major: 'english', gradYear: '2021', minor : 'math', image: '' })
      .then((res) => {
        expect(res.header.location).to.equal('/usersettings')
        expect(res.statusCode).to.equal(302)
        done()
      }).catch((err) => done(err))
  })
  
  after((done) => {
    User.deleteOne({ userName: '1' }, function (err, obj) {
      if (err) {
        console.log(err)
      }
      done()
    })
  })
})