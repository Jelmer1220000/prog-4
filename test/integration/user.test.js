process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal';

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
const database = require('../../src/database/databaseConnection');

chai.should()
chai.use(chaiHttp)

const CLEAR_ALL = 'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'

const INSERT_USER =
    'INSERT INTO `user` (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES' +
    '("first", "last", "true", "name@server.nl", "secret", "06-11223344", "street", "city", "guest");'


    

describe('User Tests 201-206', () => {
  describe('UC201 Register as new user', () => {
    beforeEach((done) => {
      // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
      database.getConnection(function (err, connection) {
        if (err) throw err // not connected!
        // Use the connection
        connection.query(CLEAR_ALL + INSERT_USER, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release()

                // Handle error after the release.
                if (error) throw error
                // Let op dat je done() pas aanroept als de query callback eindigt!
                done()
            }
        )
    })
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
          roles: '',
          phoneNumber: '06-11223344'
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
          Error.should.be.an('string').that.contains('firstName is invalid!')

          done()
        })
    })

    it('TC-201-2 emailAdress contains Invalid character', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'first',
          lastName: 'last',
          street: "",
          city: 'Breda',
          isActive: true,
          roles: '',
          //# is forbidden
          emailAdress: "name#$%@server.nl",
          password: 'secret',
          phoneNumber: '06-11223344'
        })
        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(400)
          res.should.be.an('object')

          res.body.should.be.an('object').that.has.all.keys('Status', 'Error')

          let { Status, Error } = res.body
          Status.should.be.an('number')
          Error.should.be.an('string').that.contains('emailAdress contains a forbidden symbol!')
          done()
        })
    })


    it('TC-201-3 Password is Invalid', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'first',
          lastName: 'last',
          street: 'street',
          city: 'city',
          isActive: true,
          emailAdress: 'name34@server.nl',
          password: 665,
          phoneNumber: '06-11223344',
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
            .that.contains('password is invalid!')
          done()
        })
    })

    it('TC-201-4 user already exists', (done) => {
      chai
        .request(server)
        .post('/api/user')
        .send({
          firstName: 'first',
          lastName: 'last',
          street: 'street',
          city: 'city',
          isActive: true,
          //This email already exists
          emailAdress: 'name@server.nl',
          password: 'secret',
          phoneNumber: '06-11223344',
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

  it('TC-201-5 user succesfully created', (done) => {
    chai
      .request(server)
      .post('/api/user')
      .send({
          firstName: 'acceptable',
          lastName: 'Test',
          street: 'Info',
          city: 'Breda',
          isActive: true,
          emailAdress: 'new.user7@server.com',
          password: 'secret',
          roles: '',
          phoneNumber: '06-11223344'
      })
      .end((err, res) => {
        assert.ifError(err)
        res.should.have.status(200)
        res.should.be.an('object')

        res.body.should.be.an('object').that.has.all.keys('Status', 'result')

        let { Status, result } = res.body
        Status.should.be.an('number')
        result.should.be
          .an('string')
          .that.contains('Succesfully created user!')
        done()
      })
  })
})

describe('UC202 View of all users', () => {
  beforeEach((done) => {
    // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
    database.getConnection(function (err, connection) {
        if (err) throw err // not connected!

        // Use the connection
        connection.query(
            CLEAR_ALL + INSERT_USER,
            function (error, results, fields) {
                // When done with the connection, release it.
                connection.release()

                // Handle error after the release.
                if (error) throw error
                // Let op dat je done() pas aanroept als de query callback eindigt!
                done()
            }
        )
    })
  })

 it('TC-202-1 Retrieve all users', (done) => {
      chai
        .request(server)
        .get('/api/user')
        //User is not logged in!
        .end((err, res) => {
          assert.ifError(err)
          res.should.have.status(200)
          res.should.be.an('object')

          res.body.should.be.an('object').that.has.all.keys('Status', 'results')

          let { Status, results } = res.body
          Status.should.be.an('number')
          results.should.be
            .an('array')
          done()
        })
    })
})

  describe('UC203 Request user profile', () => {
    beforeEach((done) => {
      // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
      database.getConnection(function (err, connection) {
          if (err) throw err // not connected!

          // Use the connection
          connection.query(
              CLEAR_ALL + INSERT_USER,
              function (error, results, fields) {
                  // When done with the connection, release it.
                  connection.release()

                  // Handle error after the release.
                  if (error) throw error
                  // Let op dat je done() pas aanroept als de query callback eindigt!
                  done()
              }
          )
      })
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