const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')

chai.should()
chai.use(chaiHttp)

describe('User Tests', () => {
  describe('UC201 Create user', () => {
    beforeEach((done) => {
      // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
      // ToDo
      done()
    })

    it('TC-201-1 should return a valid error when required value is not present', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          //Firstname missing!
          lastName: 'Test',
          street: 'Info',
          city: 'Breda',
          isActive: true,
          emailAdress: 'Heroku.works@server.com',
          password: 'secret',
          phonenumber: '06-11223344'
        })

        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(400)
          res.should.be.an('object')

          res.body.should.be
            .an('object')
            .that.has.all.keys('Status', 'Error')

          let { Status, Error } = res.body
          Status.should.be.an('number')
          Error.should.be.an('string').that.contains('First Name is invalid!')

          done()
        })
    })

    it('TC-201-2 should return a valid error when street is invalid', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'John',
          lastName: 'Test',
          //Incorrect street (should be string)
          street: 6689,
          city: 'Breda',
          isActive: true,
          emailAdress: 'Heroku.works@server.com',
          password: 'secret',
          phonenumber: '06-11223344'
        })
        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(400)
          res.should.be.an('object')

          res.body.should.be.an('object').that.has.all.keys('Status', 'Error')

          let { Status, Error } = res.body
          Status.should.be.an('number')
          Error.should.be.an('string').that.contains('Street is invalid!')
          done()
        })
    })
    it('TC-201-3 should return a valid error when email already exists', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          street: 'Lovendijkstraat 61',
          city: 'Breda',
          isActive: true,
          //This email already exists
          emailAdress: 'John.Doe@server.com',
          password: 'secret',
          phonenumber: '06-11223344',
        })
        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(400)
          res.should.be.an('object')

          res.body.should.be.an('object').that.has.all.keys('Status', 'Error')

          let { Status, Error } = res.body
          Status.should.be.an('number')
          Error.should.be
            .an('string')
            .that.contains('An user with this Email adress already exists!')
          done()
        })
    })
  })
  describe('UC203 Request user profile', () => {
    beforeEach((done) => {
      // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
      // ToDo
      done()
    })
    it('TC-203-1 should return valid error when user is not logged in!', (done) => {
      chai
        .request(server)
        .get('/api/user/profile')
        //User is not logged in!
        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(401)
          res.should.be.an('object')

          res.body.should.be.an('object').that.has.all.keys('Status', 'Error')

          let { Status, Error } = res.body
          Status.should.be.an('number')
          Error.should.be
            .an('string')
            .that.contains('This Endpoint is currently Unavailable!')
          done()
        })
    })




  })
})
