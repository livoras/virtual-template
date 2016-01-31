var util = require('util')
var fs = require('fs')
var vTemplate = require('../src/virtual-template')
var $ = require('cheerio')
var chai = require('chai')

chai.should()
require('mocha-jsdom')()

// var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')
var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')
var str3 = fs.readFileSync('./fixtures/test3.html', 'utf-8')

function dom(el) {
  var div = document.createElement('div')
  div.appendChild(el.dom)
  return $(div.innerHTML)
}

describe('Test fixtures', function () {
  it('fixture2', function () {
    var tpl = vTemplate.compile(str2)
    var list = ['value1', 'value2', 'value3', 'value4']
    var el = tpl({
      age: 12,
      title: 'good title',
      list: list
    })
    var e = dom(el)
    e.find('h1').attr('age').should.equal('12')
    e.find('h1').html().should.equal('good title')
    list.forEach(function (item, i) {
      e.find('li').eq(i).html().should.equal(i + 1 + ' : ' + item)
    })
  })

  it('fixture3', function () {
    var tpl = vTemplate.compile(str3)
    var users = [
      {
        id: 1,
        name: 'Jerry',
        isVIP: false,
        desc: "I love tomy"
      },
      {
        id: 2,
        name: 'Tomy',
        isVIP: true,
        desc: "fuck off, jerry"
      },
      {
        id: 3,
        name: 'Lucy',
        isVIP: false,
        desc: "You both shut up!"
      }
    ]
    var el = tpl({
      isAdmin: true,
      users: users
    })
    var e = dom(el)
    e.find('#admin div').html().should.be.equal('Admin Header')
    e.find('#customer').length.should.be.equal(0)
    e.find('#saler').length.should.be.equal(0)
    e.find('li.user-item').length.should.be.equal(3)
    e.find('li.user-item > div').eq(1).html().should.match(/This is a VIP/)
    e.find('li.user-item img')[1].attribs.src.should.equal('/avatars/2')
    users.forEach(function (user, i) {
      e.find('div.user-desc').eq(i).html().should.equal(
        'My name is ' + users[i].name + ', this is my desc: ' + users[i].desc
      )
    })
  })
})
