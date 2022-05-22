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
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 2);"

describe('Meal tests 301-305', () => {
    describe('UC301 create meal', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
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
        });
        beforeEach((done) => {
            chai.request(server).post('/api/auth/login').send({
                emailAdress: 'name@server.nl',
                password: 'secret'
            }).end((err, res) => {
                if (err) console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })

        it('TC-301-1 should return a valid error when required value is not present', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set('authorization', 'Bearer ' + token)
                .send({
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                    cookId: 1,
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
                        .that.contains('Name is invalid!')

                    done()
                })
        })

        it('TC-301-2 should return a valid error when user is not logged in', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set('authorization', 'Bearer ' + token.substring(0, 10))
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                    cookId: 1,
                })
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

        it('TC-301-3 should add meal to database', (done) => {
            chai.request(server)
                .post('/api/meal')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(201)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('object').that.contains({
                        id: result.id,
                        name: 'Lasagne',
                        description: 'Overheerlijke Lasagne',
                        imageUrl: 'https://www.google.nl',
                        dateTime: '2022-04-26:18:00',
                        maxAmountOfParticipants: 8,
                        price: 5.55,
                        cookId: 1,
                    })
                    done()
                })
        })
    })

    describe('UC302 edit meal', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
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
        });
        beforeEach((done) => {
            chai.request(server).post('/api/auth/login').send({
                emailAdress: 'name@server.nl',
                password: 'secret'
            }).end((err, res) => {
                if (err) return console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })
    
        it('TC-302-1 should return a valid error when required value is not present', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .set('authorization', 'Bearer ' + token)
                .send({
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
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
                        .that.contains('Name is invalid!')

                    done()
                })
        })

        it('TC-302-2 should return a valid error when user is not logged in', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .set('authorization', 'Bearer ' + token.substring(0, 10))
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                })
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

        it('TC-302-3 should return a valid error when user is not the owner', (done) => {
            chai.request(server)
                .put('/api/meal/2')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(403)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('User is not the owner')
                     done()
                })
        })

        it('TC-302-4 should return a valid error when the meal does not exist', (done) => {
            chai.request(server)
                .put('/api/meal/90')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
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
                        .that.contains(`Meal does not exist`)
                    done()
                })
        })
    
        it('TC-302-5 succesfully edited meal', (done) => {
            chai.request(server)
                .put('/api/meal/1')
                .set('authorization', 'Bearer ' + token)
                .send({
                    name: 'Lasagne',
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
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
                    result.should.be.an('object')
                    done()
                })
        })
    })

    describe('UC303 List of meals', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
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
        });
        beforeEach((done) => {
            chai.request(server).post('/api/auth/login').send({
                emailAdress: 'name@server.nl',
                password: 'secret'
            }).end((err, res) => {
                if (err) console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })
    
        it('TC-303-1 should return a list of meals', (done) => {
            chai.request(server)
                .get('/api/meal')
                .set('authorization', 'Bearer ' + token)
                .send({
                    description: 'Overheerlijke Lasagne',
                    imageUrl: 'https://www.google.nl',
                    dateTime: '2022-04-26:18:00',
                    maxAmountOfParticipants: 8,
                    price: 5.55,
                    cookId: 1,
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
                    result.should.be
                        .an('array').that.has.length(2);
                    done()
                })
        })
    })
    describe('UC304 Details of meals', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
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
        });

        it('TC-304-1 Meal does not exist', (done) => {
            chai.request(server)
                .get('/api/meal/10')
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
                        .an('string').that.contains("Meal does not exist");
                    done()
                })
        })

        it('TC-304-2 Meal does exist show details', (done) => {
            chai.request(server)
                .get('/api/meal/1')
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
                        .an('object').that.contains({
                            id: result.id
                        });
                    done()
                })
        })
    })

    describe('UC305 Delete meals', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER + INSERT_MEALS,
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
        });
        beforeEach((done) => {
            chai.request(server).post('/api/auth/login').send({
                emailAdress: 'name@server.nl',
                password: 'secret'
            }).end((err, res) => {
                if (err) return console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })

        it('TC-305-2 User not logged in', (done) => {
            chai.request(server)
                .delete('/api/meal/1241244142')
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
                        .that.contains('Authorization header missing!')
                    done()
                })
        })

        it("TC-305-3 meal isn't the Owner", (done) => {
            chai.request(server)
                .delete('/api/meal/2')
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(403)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('User is not the owner')
                    done()
                })
        })
        it("TC-305-4 meal doesn't exist", (done) => {
            chai.request(server)
                .delete('/api/meal/1241244142')
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

        it('TC-305-5 meal succesfully deleted', (done) => {
            chai.request(server)
                .delete('/api/meal/1')
                .set('authorization', 'Bearer ' + token)
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('Succesfully deleted')
                    done()
                })
        })

    })

})
