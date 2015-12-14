/* global describe, it */

var _ = require('../lib/utils.js')
var chai = require('chai')
chai.should()

var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)

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

  it('Test nextTick', function (done) {
    _.nextTick.should.be.equal(process.nextTick)
    process.env.NODE_ENV = null
    delete require.cache[require.resolve('../lib/utils.js')]
    var new_ = require('../lib/utils.js')
    global.window = {}
    var spy = sinon.spy()
    new_.nextTick(spy)
    setTimeout(function () {
      spy.should.have.been.called
      done()
    }, 2)
  })

  it('Test nextTick should when has requestAnimationFrame', function (done) {
    delete process.env.NODE_ENV
    var fn = sinon.spy()
    window.requestAnimationFrame = fn
    delete require.cache[require.resolve('../lib/utils.js')]
    var new_ = require('../lib/utils.js')
    var spy = sinon.spy()
    new_.nextTick(spy)
    fn.should.has.been.called
    done()
  })
})
