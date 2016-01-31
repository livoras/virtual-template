var fs = require('fs')
var vTemplate = require('../src/virtual-template')
var util = require('util')
var $ = require('cheerio')
var chai = require('chai')

chai.should()
// require('mocha-jsdom')({skipWindowCheck: true})

var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')
var str3 = fs.readFileSync('./fixtures/test3.html', 'utf-8')

function dom(el) {
  var div = document.createElement('div')
  div.appendChild(el.dom)
  return $(div.innerHTML)
}

describe('DOM should be change when call setData API', function () {
  it ('setting data', function () {
    var tpl = vTemplate.compile(str2)
    var list = ['value1', 'value2', 'value3', 'value4']
    var el = tpl({
      age: 12,
      title: 'good title',
      list: list
    })
    var e = dom(el)
    e.find('h1').html().should.equal('good title')
    e.find('li').length.should.equal(4)
    e.find('#toggle').length.should.equal(1)
    el.setData({
      age: 13,
      title: 'new title',
      list: ['fu1', 'fu2', 'fu3', 'fu4', 'fu5']
    }, true)
    e = dom(el)
    e.find('h1').html().should.equal('new title')
    e.find('li').length.should.equal(5)
    e.find('#toggle').length.should.equal(0)
  })

  it ('asyn set', function (done) {
    var tpl = vTemplate.compile(str2)
    var list = ['value1', 'value2', 'value3', 'value4']
    var el = tpl({
      age: 12,
      title: 'good title',
      list: list
    })
    var e = dom(el)
    e.find('h1').html().should.equal('good title')
    e.find('li').length.should.equal(4)
    e.find('#toggle').length.should.equal(1)
    el.setData({
      age: 13,
      title: 'new title',
      list: ['fu1', 'fu2', 'fu3', 'fu4', 'fu5']
    })
    e.find('h1').html().should.equal('good title')
    e.find('li').length.should.equal(4)
    setTimeout(function () {
      e = dom(el)
      e.find('h1').html().should.equal('new title')
      e.find('li').length.should.equal(5)
      e.find('#toggle').length.should.equal(0)
      done()
    })
  })
})
