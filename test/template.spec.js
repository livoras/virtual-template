/* global describe, it */

var chai = require('chai')
chai.should()

var template = require('../lib/template')

describe('Test init', function () {
  it('Test template', function () {
    template.name.should.be.equal('virtual-template')
  })
})
