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
    '(1, "first", "last", "name@server.nl", "Secret!9321", "street", "city"),' +
    '(2, "second", "last2", "name2@server.nl", "Secret!9321", "street", "city"),' +
    '(3, "third", "last3", "name3@server.nl", "Secret!9321", "street", "city");'

/**
 * Query om twee meals toe te voegen. Let op de UserId, die moet matchen
 * met de user die je ook toevoegt.
 */
const INSERT_MEALS =
    'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
    "(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
    "(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"

let token;

describe('User Tests 201-206', () => {
    describe('UC201 Register as new user', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER,
                    function (Error, result, fields) {
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
        it('TC-201-1 should return a valid Error when required value is not present', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    //Firstname missing!
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'Herokuwork@server.com',
                    password: 'Secret!9321',
                    phoneNumber: '06-11223344',
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
                        .that.contains('firstName is invalid!')

                    done()
                })
        })

        it('TC-201-2 Invalid Email', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'firdaswddst',
                    lastName: 'last',
                    street: '',
                    city: 'Breda',
                    isActive: 1,
                    roles: '',
                    emailAdress: 'name#$#%@server.nl',
                    password: 'Secret!9321',
                    phoneNumber: '06-11223344',
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
                        .that.contains('Email is invalid')
                    done()
                })
        })

        it('TC-201-3 Password is Invalid', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'fsdsd',
                    lastName: 'dfssfef',
                    street: 'street',
                    city: 'city',
                    isActive: 1,
                    emailAdress: 'name34@server.nl',
                    password: 'test',
                    phoneNumber: '06-11223344',
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
                        .that.contains('Password is Invalid')
                    done()
                })
        })

        it('TC-201-4 user already exists', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'first',
                    lastName: 'last',
                    street: 'street',
                    city: 'city',
                    isActive: 1,
                    //This email already exists
                    emailAdress: 'name@server.nl',
                    password: 'Secret!9321',
                    phoneNumber: '06-11223344',
                })
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(409)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'message')

                    let { Status, message } = res.body
                    Status.should.be.an('number')
                    message.should.be
                        .an('string')
                        .that.contains('Email already exists!')
                    done()
                })
        })

        it('TC-201-5 user succesfully created', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    firstName: 'acceptable',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'new.user57@server.com',
                    password: 'Secret!9321',
                    phoneNumber: '06-11223344',
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
                        firstName: 'acceptable',
                        lastName: 'Test',
                        street: 'Info',
                        city: 'Breda',
                        isActive: 1,
                        emailAdress: 'new.user57@server.com',
                        password: 'Secret!9321',
                        phoneNumber: '06-11223344',
                    })
                    done()
                })
        })
    })

    describe('UC202 View all users', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!
                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER,
                    function (Error, result, fields) {
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

        it('TC-202-1 Retrieve no users', (done) => {
            chai.request(server)
                .get('/api/user?length=0')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.is.empty;
                    done()
                })
        })

        it('TC-202-2 Retrieve 2 users', (done) => {
            chai.request(server)
                .get('/api/user?length=2')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.has.length(2);
                    done()
                })
        })

        it("TC-202-3 Retrieve users that don't exist", (done) => {
            chai.request(server)
                .get('/api/user?firstName=hkjh')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.is.empty;
                    done()
                })
        })

        it('TC-202-4 Retrieve users with active = false (0 users)', (done) => {
            chai.request(server)
                .get('/api/user?isActive=false')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.is.empty;
                    done()
                })
        })

        it('TC-202-5 Retrieve users with active = true', (done) => {
            chai.request(server)
                .get('/api/user?isActive=true')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.has.length(3)
                    done()
                })
        })

        it('TC-202-6 Retrieve users on firstName = first (1 user)', (done) => {
            chai.request(server)
                .get('/api/user?firstName=first')
                .end((err, res) => {
                    assert.ifError(err)
                    res.should.have.status(200)
                    res.should.be.an('object')

                    res.body.should.be
                        .an('object')
                        .that.has.all.keys('Status', 'result')

                    let { Status, result } = res.body
                    Status.should.be.an('number')
                    result.should.be.an('array').that.has.length(1);
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
                    function (Error, result, fields) {
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
                password: 'Secret!9321'
            }).end((err, res) => {
                if (err) console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })

        it('TC-203-1 invalid token', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .set('authorization', 'Bearer ' + token.substring(7, 10))
                
                //User is not logged in!
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
                        .that.contains(
                            'Not authorized'
                        )
                    done()
                })
        })

        it('TC-203-2 Valide token, user exists', (done) => {
            chai.request(server)
                .get('/api/user/profile')
                .set('authorization', 'Bearer ' + token)
                //User is not logged in!
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
                        .that.contains(
                            {
                                id: 1
                            }
                        )
                    done()
                })
        })
    })

    describe('UC204 Request user Details', () => {
        beforeEach((done) => {
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

        it('TC-204-1 Invalid Token, user not Logged in', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .set('authorization', 'Bearer ' + token.substring(1, 15))
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

        it("TC-204-2 Retrieve user by ID, Id doesn't exist", (done) => {
            chai.request(server)
                .get('/api/user/900123')
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
                        .that.contains('User does not exist')
                    done()
                })
        })

        it('TC-204-3 Retrieve user by ID, Id does exist', (done) => {
            chai.request(server)
                .get('/api/user/1')
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
                    result.should.be.an('object').that.contains({
                        id: 1,
                        firstName: 'first',
                        lastName: 'last',
                        city: 'city',
                        street: 'street',
                        emailAdress: 'name@server.nl',
                        isActive: 1,
                        password: 'Secret!9321',
                        roles: 'editor,guest',
                        phoneNumber: '-',
                    })
                    done()
                })
        })
    })
    describe('UC205 Editing user', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER,
                    function (Error, result, fields) {
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
                password: 'Secret!9321'
            }).end((err, res) => {
                if (err) console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })


        it('TC-205-1 Required value Email is missing', (done) => {
            chai.request(server)
                .put('/api/user/1')
                .set('authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Heroku',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    password: 'Secret!9321',
                    roles: '',
                    phoneNumber: '06-11223344',
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
                        .that.contains('Email is invalid')
                    done()
                })
        })

        it('TC-205-3 Invalid phone number', (done) => {
            chai.request(server)
                .put('/api/user/1')
                .set('authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Heroku',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'Heroku.works@server.com',
                    password: 'Secret!9321',
                    roles: '',
                    phoneNumber: 06 - 11223344,
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
                        .that.contains('phone number is invalid')
                    done()
                })
        })

        it("TC-205-4 User doesn't exist", (done) => {
            chai.request(server)
                .put('/api/user/900204')
                .set('authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Heroku',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'Heroku.works@server.com',
                    password: 'Secret!9321',
                    roles: '',
                    phoneNumber: '+31636363634',
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
                        .that.contains('User does not exist')
                    done()
                })
        })

        it('TC-205-5 User is not logged in', (done) => {
            chai.request(server)
                .put('/api/user/2141221')
                .send({
                    firstName: 'Heroku',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'Heroku.works@server.com',
                    password: 'Secret!9321',
                    roles: '',
                    phoneNumber: '06-11223344',
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
                        .that.contains('Authorization header missing!')
                    done()
                })
        })

        it('TC-205-6 User succesfully edited', (done) => {
            chai.request(server)
                .put('/api/user/1')
                .set('authorization', 'Bearer ' + token)
                .send({
                    firstName: 'Heroku',
                    lastName: 'Test',
                    street: 'Info',
                    city: 'Breda',
                    isActive: 1,
                    emailAdress: 'Heroku3432.works@server.com',
                    password: 'Secret!9321',
                    roles: '',
                    phoneNumber: '+31636363634',
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
                        id: 1,
                        firstName: 'Heroku',
                        lastName: 'Test',
                        street: 'Info',
                        city: 'Breda',
                        isActive: 1,
                        emailAdress: 'Heroku3432.works@server.com',
                        password: 'Secret!9321',
                        roles: '',
                        phoneNumber: '+31636363634',
                    })
                    done()
                })
        })
    })

    describe('UC206 Deleting user', () => {
        beforeEach((done) => {
            // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
            database.getConnection(function (err, connection) {
                if (err) throw err // not connected!

                // Use the connection
                connection.query(
                    CLEAR_ALL + INSERT_USER,
                    function (Error, result, fields) {
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
                password: 'Secret!9321'
            }).end((err, res) => {
                if (err) console.log(err)
                token = res.body.result.token;
                res.should.have.status(200)
                done()
            })
        })

        it("TC-206-1 User doesn't exist", (done) => {
            chai.request(server)
                .delete('/api/user/1241244142')
                .set('authorization', 'Bearer ' + token)
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
                        .that.contains('User does not exist')
                    done()
                })
        })

        it('TC-206-2 User not logged in', (done) => {
            chai.request(server)
                .delete('/api/user/1241244142')
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

        it("TC-206-3 User isn't the Owner", (done) => {
            chai.request(server)
                .delete('/api/user/2')
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

        it('TC-206-4 User succesfully deleted', (done) => {
            chai.request(server)
                .delete('/api/user/1')
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
