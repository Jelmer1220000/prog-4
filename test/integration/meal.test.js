process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal';

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')
const database = require('../../src/database/databaseConnection')

chai.should()
chai.use(chaiHttp)

const CLEAR_ALL = 'DELETE IGNORE FROM `meal`; DELETE IGNORE FROM `meal_participants_user`; DELETE IGNORE FROM `user`;'

const INSERT_USER =
    'INSERT INTO `user` (id, firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES' +
    '(1,"first", "last", "true", "name@server.nl", "secret", "06-11223344", "street", "city", "guest");'

const INSERT_MEALS =
'INSERT INTO `meal` (`id`, `name`, `description`, `imageUrl`, `dateTime`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES' +
"(1, 'Meal A', 'description', 'image url', NOW(), 5, 6.50, 1)," +
"(2, 'Meal B', 'description', 'image url', NOW(), 5, 6.50, 1);"


describe('Meal tests 301-305', () => {
  describe('UC301 create meal', () => {
    beforeEach((done) => {
      database.getConnection(function (err, connection) {
        if (err) throw err // not connected!
        // Use the connection
        connection.query(CLEAR_ALL + INSERT_USER + INSERT_MEALS, function (error, results, fields) {
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

    it('TC-301-1 should return a valid error when required value is not present', (done) => {
        chai
        .request(server)
        .post('/api/meal')
        .send({
          //Name missing
            description: 'Lasagne Bolognese',
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: false,
            dateTime: '2022-04-26:18:00',
            imageUrl: 'https://www.google.nl',
            allergenes: ['Gluten', 'MILK'],
            maxAmountOfParticipants: 8,
            price: 5.55,
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
          Error.should.be.an('string').that.contains('Name is invalid!')

          done()
        })
    })

    it('TC-301-2 should return a valid error when user is not logged in', (done) => {
        chai
          .request(server)
          .post('/api/meal')
          .send({
            name: 'Lasagne',
            //Description wrong type
            description: 543563,
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: false,
            dateTime: '2022-04-26:18:00',
            imageUrl: 'https://www.google.nl',
            allergenes: ['Gluten', 'MILK'],
            maxAmountOfParticipants: 8,
            price: 5.55,
          })
          .end((err, res) => {
            assert.ifError(err)
            res.should.have.status(400)
            res.should.be.an('object')
  
            res.body.should.be.an('object').that.has.all.keys('Status', 'Error')
  
            let { Status, Error } = res.body
            Status.should.be.an('number')
            Error.should.be.an('string').that.contains('Description is invalid!')
            done()
          })
      })

      it('TC-301-3 should add meal to database', (done) => {
        chai
          .request(server)
          .post('/api/meal')
          .send({
            name: 'Lasagne',
            description: "Overheerlijke Lasagne",
            isActive: true,
            isVega: true,
            isVegan: true,
            isToTakeHome: false,
            dateTime: '2022-04-26:18:00',
            imageUrl: 'https://www.google.nl',
            allergenes: ['Gluten', 'MILK'],
            maxAmountOfParticipants: 8,
            price: 5.55,
          })
          .end((err, res) => {
            assert.ifError(err)
            res.should.have.status(200)
            res.should.be.an('object')
  
            res.body.should.be.an('object').that.has.all.keys('Status', 'result')
  
            let { Status, result } = res.body
            Status.should.be.an('number')
            result.should.be.an('string').that.contains('Succesfully created meal!')
            done()
          })
      })
  })
})
