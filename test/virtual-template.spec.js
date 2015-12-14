/* global describe, it */

var vt = require('../lib/virtual-template')
var chai = require('chai')
var fs = require('fs')
var template = require('art-template')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
chai.use(sinonChai)

template.config('openTag', '{')
template.config('closeTag', '}')
chai.should()

function read (name) {
  return fs.readFileSync(__dirname + '/fixtures/' + name, 'utf-8')
}

describe('Test Virtual-Template', function () {
  it('Accepet a compiler function and return a class', function () {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var UserTemplate = vt(userCompiler)
    var jerry = new UserTemplate({
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Green')
    jerry.dom.children[1].innerHTML.should.be.equal('12')
    jerry.dom.children[2].innerHTML.should.be.equal('I am Jerry!!')

    jerry.setData({age: 13}, true)
    jerry.dom.children[1].innerHTML.should.be.equal('13')

    jerry.setData({lastName: 'Dai'}, true)
    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Dai')
  })

  it('Virtual-Template instances will not influence each other', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var UserTemplate = vt(userCompiler)
    var jerry = new UserTemplate({
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })

    var lucy = new UserTemplate({
      firstName: 'Lucy',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Lucy!!'
    })

    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Green')
    lucy.dom.children[0].innerHTML.should.be.equal('Lucy Green')

    jerry.setData({lastName: 'Dai'})

    setTimeout(function () {
      jerry.dom.children[0].innerHTML.should.be.equal('Jerry Dai')
      lucy.dom.children[0].innerHTML.should.be.equal('Lucy Green')
      done()
    }, 40)
  })

  it('Passing compiler with data', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Green')
    jerry.setData({lastName: 'Dai'})
    setTimeout(function () {
      jerry.dom.children[0].innerHTML.should.be.equal('Jerry Dai')
      done()
    }, 20)
  })

  it('Callback after dom updated', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Green')
    var spy = sinon.spy()
    jerry.setData({lastName: 'Dai'}, spy)
    setTimeout(function () {
      jerry.dom.children[0].innerHTML.should.be.equal('Jerry Dai')
      spy.should.have.been.called
      done()
    }, 20)
  })

  it('No callback after dom updated', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    jerry.dom.children[0].innerHTML.should.be.equal('Jerry Green')
    jerry.setData({lastName: 'Dai'}, false)
    setTimeout(function () {
      jerry.dom.children[0].innerHTML.should.be.equal('Jerry Dai')
      done()
    }, 20)
  })

  it('Multiple updates, multiple callbacks', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    var spy1 = sinon.spy()
    var spy2 = sinon.spy()
    jerry.setData({firstName: 'Lucy'}, spy1)
    jerry.setData({lastName: 'Blue'}, spy2)
    setTimeout(function () {
      spy1.should.have.been.called
      spy2.should.have.been.called
      jerry.flushCallbacks.should.be.deep.equal([])
      done()
    }, 20)
  })

  it('Multiple callbacks should be call in order', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    var spy1 = sinon.spy()
    var spy2 = sinon.spy()
    var spy3 = sinon.spy()
    jerry.setData({firstName: 'Lucy'}, spy1)
    jerry.setData({lastName: 'Blue'}, spy2)
    jerry.setData({lastName: 'Blue'}, spy3)
    setTimeout(function () {
      spy1.should.have.been.called
      spy2.should.have.been.called
      spy3.should.have.been.called
      spy1.should.be.calledBefore(spy2)
      spy2.should.be.calledBefore(spy3)
      jerry.flushCallbacks.should.be.deep.equal([])
      done()
    }, 20)
  })

  it('Test with invalid callbacks', function (done) {
    var userTpl = read('user.html')
    var userCompiler = template.compile(userTpl)
    var jerry = vt(userCompiler, {
      firstName: 'Jerry',
      lastName: 'Green',
      age: 12,
      introduction: 'I am Jerry!!'
    })
    var spy1 = sinon.spy()
    var spy2 = sinon.spy()
    var spy3 = null
    jerry.setData({firstName: 'Lucy'}, spy1)
    jerry.setData({lastName: 'Blue'}, spy2)
    jerry.setData({lastName: 'Blue'}, spy3)
    setTimeout(function () {
      spy1.should.have.been.called
      spy2.should.have.been.called
      done()
    })
  })
})
