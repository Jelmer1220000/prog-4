process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal'

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
const database = require('../../config/database/databaseConnection')

chai.should()
chai.use(chaiHttp)

const CLEAR_ALL =
    'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `user`;'

    const INSERT_USER =
    'INSERT INTO `user` (`id`, `firstName`, `lastName`, `emailAdress`, `password`, `street`, `city` ) VALUES' +
    '(1, "first", "last", "name@server.nl", "Secret!9321", "street", "city"),' +
    '(2, "second", "last2", "name2@server.nl", "Secret!9321", "street", "city"),' +
    '(3, "third", "last3", "name3@server.nl", "Secret!9321", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de UserId, die moet matchen
 * met de user die je ook toevoegt.
 */
const INSERT_PARTICIPANTS =
'INSERT INTO `meal_participants_user` (`mealId`, `userId`) VALUES' +
'(1, 1),'


const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 2);"

describe('Participate tests 401 - 402', () => {
    describe('UC401 Register for meal', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
                    function (Error, results, fields) {
                        connection.release()
                        if (Error) console.log(Error)
                        chai.request(server).post('/api/auth/login').send({
                            emailAdress: 'name@server.nl',
                            password: 'Secret!9321'
                        }).end((err, res) => {
                            if (err) console.log(err)
                            token = res.body.result.token;
                            res.should.have.status(200)
                            done()
                        })
                    })
            })
        })

        it('TC-401-1 Not logged in', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                .set('authorization', 'Bearer ' + token.substring(1, 10))
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('Not authorized')
                    done()
                })
        })

        it('TC-401-2 Meal does not exist', (done) => {
            chai.request(server)
                .get('/api/meal/100/participate')
                .set('authorization', 'Bearer ' + token)
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
                        .that.contains('Meal does not exist')
                    done()
                })
        })

        it.skip('TC-401-3 succesfully registered', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be
                        .an('object')
                        .that.contains({
                            currentlyParticipating: true,
                            currentAmountOfParticipants: result.currentAmountOfParticipants
                        })
                    done()
                })
        })
    })

    describe('UC402 Unregister from meal', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
                    function (Error, results, fields) {
                        connection.release()
                        if (Error) console.log(Error)
                        chai.request(server).post('/api/auth/login').send({
                            emailAdress: 'name@server.nl',
                            password: 'Secret!9321'
                        }).end((err, res) => {
                            if (err) console.log(err)
                            token = res.body.result.token;
                            res.should.have.status(200)
                            done()
                        })
                    })
            })
        })

        it('TC-402-1 Not logged in', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                .set('authorization', 'Bearer ' + token.substring(1, 10))
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(401)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('Not authorized')
                    done()
                })
        })

        it('TC-402-2 Meal does not exist', (done) => {
            chai.request(server)
                .get('/api/meal/100/participate')
                .set('authorization', 'Bearer ' + token)
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
                        .an('string').that.contains('Meal does not exist')
                    done()
                })
        })

        it.skip('TC-401-3 succesfully unregistered', (done) => {
            chai.request(server)
                .get('/api/meal/1/participate')
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    done()
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be
                        .an('object')
                        .that.contains({
                            currentlyParticipating: false,
                            currentAmountOfParticipants: result.currentAmountOfParticipants
                        })
                    done()
                })
        })
    })
})