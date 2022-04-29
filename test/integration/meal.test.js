const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../index')
const assert = require('assert')

chai.should()
chai.use(chaiHttp)

describe('Meal tests', () => {
  describe('UC301 create meal', () => {
    beforeEach((done) => {
      // maak de testdatabase leeg zodat we onze testen kunnen uitvoeren.
      // ToDo
      done()
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

    it('TC-301-2 should return a valid error when value is invalid', (done) => {
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
  })
})
