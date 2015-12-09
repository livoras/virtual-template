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
})
