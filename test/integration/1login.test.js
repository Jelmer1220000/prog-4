process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
const database = require('../../config/database/databaseConnection')

chai.should()
chai.use(chaiHttp)

const CLEAR_ALL =
    'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'
//Im done with this fucking database testing crap through github
const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "name@server.nl", "secret", "street", "city"),' +
    '(2, "second", "last2", "name2@server.nl", "secret", "street", "city"),' +
    '(3, "third", "last3", "name3@server.nl", "secret", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de UserId, die moet matchen
 * met de user die je ook toevoegt.
 */
const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

let token

describe('Uc 101 Login', () => {
    beforeEach((done) => {
        // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
        database.getConnection(function (err, connection) {
            if (err) throw err // not connected!

            // Use the connection
            connection.query(
                CLEAR_ALL + INSERT_USER,
                function (Error, results, fields) {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle Error after the release.
                    if (Error) throw Error
                    // Let op dat je done() pas aanroept als de query callback eindigt!
                    done()
                }
            )
        })
    })

    it('TC-101-1 should return a valid Error when required value is not present', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'name@server.nl',
            })
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(400)
                res.should.be.an('object')

                res.body.should.be
                    .an('object')
                    .that.has.all.keys('Status', 'message')

                let { Status, message } = res.body
                Status.should.be.an('number')
                message.should.be
                    .an('string')
                    .that.contains('password must be a string')

                done()
            })
    })

    it('TC-101-2 Invalid Email', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'name#$^&@sver.nl',
                password: 'secret',
            })
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(400)
                res.should.be.an('object')

                res.body.should.be
                    .an('object')
                    .that.has.all.keys('Status', 'message')

                let { Status, message } = res.body
                Status.should.be.an('number')
                message.should.be
                    .an('string')
                    .that.contains('Email Invalid!')

                done()
            })
    })

    it('TC-101-3 Invalid Password', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'name@server.nl',
                password: 'secret12431231',
            })
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(400)
                res.should.be.an('object')

                res.body.should.be
                    .an('object')
                    .that.has.all.keys('Status', 'message')

                let { Status, message } = res.body
                Status.should.be.an('number')
                message.should.be
                    .an('string')
                    .that.contains('Password or Email invalid')

                done()
            })
    })

    it('TC-101-4 user does not exist', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'na@rver.nl',
                password: 'secret',
            })
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(404)
                res.should.be.an('object')

                res.body.should.be
                    .an('object')
                    .that.has.all.keys('Status', 'message')

                let { Status, message } = res.body
                Status.should.be.an('number')
                message.should.be
                    .an('string')
                    .that.contains('User not found')

                done()
            })
    })

    it('TC-101-5 succesful login', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'name@server.nl',
                password: 'secret',
            })
            .end((err, res) => {
                assert.ifError(err)
                res.should.have.status(200)
                res.should.be.an('object')

                res.body.should.be
                    .an('object')
                    .that.has.all.keys('Status', 'result')

                let { Status, result } = res.body
                Status.should.be.an('number')
                result.should.be.an('object').that.contains({
                    id: result.id,
                    firstName: 'first',
                    lastName: 'last',
                    street: 'street',
                    city: 'city',
                })

                done()
            })
    })
})
