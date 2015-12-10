/* global describe, it */

var _ = require('../lib/utils.js')
var chai = require('chai')
chai.should()

describe('Test utilities', function () {
  it('Test extend', function () {
    var dest = {name: 'jerry'}
    var src = {
      obj: {
        what: 'The',
        fuck: '!'
      },
      age: '12'
    }
    _.extend(dest, src)
    dest.should.be.deep.equal({
      name: 'jerry',
      obj: {
        what: 'The',
        fuck: '!'
      },
      age: '12'
    })
  })

  it('Test extend, never extend prototype', function () {
    function User (name) {
      this.name = name
    }
    User.prototype.age = 12
    var jerry = new User('jerry')
    var a = _.extend({}, jerry)
    a.should.have.property('name')
    a.should.not.have.property('age')
  })
})
