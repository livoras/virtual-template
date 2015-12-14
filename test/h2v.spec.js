/* global describe, it */

var h2v = require('../lib/h2v')
var chai = require('chai')
var fs = require('fs')

chai.should()
var jsdom = require('mocha-jsdom')
jsdom()

describe('Make virtual-dom from html', function () {
  it('Making a single root.', function () {
    var el = h2v('<ul></ul>').vdom
    el.tagName.should.be.equal('ul')
  })

  it('If has multiple roots, make a div wrap them all.', function () {
    var el = h2v('<ul></ul><p></p>').vdom
    el.tagName.should.be.equal('div')
  })

  it('DOM\'s innerHTML generated from virtual-dom should be the same as original html string', function () {
    var htmls = [
      fs.readFileSync(__dirname + '/fixtures/test1.html', 'utf-8'),
      fs.readFileSync(__dirname + '/fixtures/test2.html', 'utf-8'),
      fs.readFileSync(__dirname + '/fixtures/test3.html', 'utf-8')
    ]
    for (var i = 0, len = htmls.length; i < len; i++) {
      var htmlString = htmls[i]
      var el = h2v(htmlString).vdom
      var dom = el.render()
      var div = document.createElement('div')
      div.appendChild(dom)
      var domString = div.innerHTML.replace(/\r\n/g, '\n')
      htmlString = htmlString.replace(/\r\n/g, '\n')
      domString.length.should.be.equal(htmlString.length)
      domString.should.be.equal(htmlString)
    }
  })

  it('Test textContent.', function () {
    var vd = h2v.toVirtualDOM({
      nodeType: 1,
      tagName: 'div',
      attributes: [],
      style: {},
      childNodes: [{
        nodeType: 3,
        textContent: 'This is a string'
      }]
    })
    vd.children[0].should.be.equal('This is a string')
  })

  it('Test nodeValue for IE.', function () {
    var vd = h2v.toVirtualDOM({
      nodeType: 1,
      tagName: 'div',
      attributes: [],
      style: {},
      childNodes: [{
        nodeType: 3,
        nodeValue: 'This is a string'
      }]
    })
    vd.children[0].should.be.equal('This is a string')
  })
})
