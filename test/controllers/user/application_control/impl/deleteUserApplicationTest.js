const expect = require('chai').expect
const request = require('supertest')
const app = require('../../../../../index')
const describe = require('mocha').describe
const it = require('mocha').it
const before = require('mocha').before
const after = require('mocha').after
const User = require('../../../../../models/User')
const Club = require('../../../../../models/Club')
const deleteUserApplication = require('../../../../../controllers/user/application_control/impl/deleteUserApplication')
var clubId = ''
describe('Test Delete User Application', function() {
  this.timeout(120000)
  before((done) => {
    request(app).post('/addUser').send({ firstName: 'test', lastName: 'user', email: 'test@email.com', userName: '0', password: '0', confirm_password: '0', major: 'comp sci', gradYear: '2020', image: '' })
    .then((res) => {
      User.findOne({ userName : '0' }, (error, user) => {
        Club.create({
          name: 'test',
          memberCount: '1',
          president_organizer: 'arv',
          email: 'test@email.com',
          phonenumber: '12345',
          description: 'test',
          category: 'academic'
        }, function(error, newClub) {
          clubId = newClub._id
          newClub.admin_applications.push({ userId: 'junkId', name: 'Arvind' })
          newClub.admin_applications.push({ userId: user._id, name: 'Arvind' })
          newClub.member_applications.push({
            userId: 'junkId',
            fullname: 'test',
            email: 'test',
            rank: 'test',
            major: 'test',
            resume : 'test',
            custom1: {
                question: 'test',
                answer: 'test'
            },
            custom2: {
                question: 'test',
                answer: 'test'
            },
            custom3: {
                question: 'test',
                answer: 'test'
            },
            status: 'Pending'
          })
          newClub.member_applications.push({
            userId: user._id,
            fullname: 'test',
            email: 'test',
            rank: 'test',
            major: 'test',
            resume : 'test',
            custom1: {
                question: 'test',
                answer: 'test'
            },
            custom2: {
                question: 'test',
                answer: 'test'
            },
            custom3: {
                question: 'test',
                answer: 'test'
            },
            status: 'Pending'
          })
          newClub.save()
          user.pending_applications.push({ clubId: 'junkId', name: 'bad club', type: 'member', status: 'Under Review' })
          user.pending_applications.push({ clubId: clubId, name: 'club', type: 'member', status: 'Under Review' })
          user.save()
          done()
        })
      })    
    }).catch((err) => done(err))
  })

  it('Test Redirect Because User is not logged in', (done) => {
    request(app).get('/deleteapplication/0').then((res) => {
      expect(res.statusCode).to.equal(302)
      done()
    }).catch((err) => done(err))
  })

  it('Test Delete User Application', (done) => {
    deleteUserApplication.testMode()
    
    request(app).get(`/deleteapplication/${clubId}`).then((res) => {
      expect(res.statusCode).to.equal(302)
      const deleteClubPromise = Club.deleteOne({ name: 'test' })
      deleteClubPromise.then(() => {
        done()
      })
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