const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const userProfileController = require('../../../../../controllers/user/profile/view/userprofile')

describe('Test User Profile View', function () {
  this.timeout(120000)
  before((done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
      .then((res) => {
        done()
      }).catch((err) => done(err))
  })

  it('Test Redirect Because User is not logged in', (done) => {
    request(app).get('/userprofile').then((res) => {
      expect(res.statusCode).to.equal(302)
      done()
    }).catch((err) => done(err))
  })

  it('Test Successful Render after login', (done) => {
    userProfileController.testMode()
    var addClubToUserPromise = User.findOne({ userName: '0' }, (error, user) => {
      var createClubPromise = Club.create({
        name: 'test',
        memberCount: '1',
        president_organizer: 'test',
        email: 'test@email.com',
        phonenumber: '1234',
        description: 'test',
        category: 'academic',
        meeting_times: 'test'
      })
      createClubPromise.then(()=> {
        var getClubPromise = Club.findOne({ name: 'test' }, (error, club) => {
          user.clubs.push(club._id);
        })
        getClubPromise.then(() => {
          user.save()
        })
      })
    })

    addClubToUserPromise.then(() => {
      request(app).get('/userprofile').then((res) => {
        expect(res.statusCode).to.equal(200)
        var deleteClubPromise = Club.deleteOne({ name: 'test'})
        deleteClubPromise.then(() => {
          done()
        })
      }).catch((err) => done(err))
    })
    
  })

  it('Test Successful Render after login without clubs', (done) => {
    userProfileController.testMode()

    request(app).get('/userprofile').then((res) => {
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
