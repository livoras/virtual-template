/**
 * Convert HTML string to simple-virtual-dom
 */

var svd = require('simple-virtual-dom')
var el = svd.el
var htmlparser = require('htmlparser2')

function h2v (html) {
  var dom
  var handler = new htmlparser.DomHandler(function (error, _dom) {
    if (error) {
      throw error
    } else {
      dom = _dom
    }
  })
  var parser = new htmlparser.Parser(handler)
  parser.write(html)
  parser.done()
  if (dom.length > 1) {
    dom = {
      type: 'tag',
      name: 'div',
      children: dom
    }
  } else {
    dom = dom[0]
  }
  return toVirtualDOM(dom)
}

function toVirtualDOM (dom) {
  if (!dom.name) {
    console.log(dom)
  }
  var tagName = dom.name.toLowerCase()
  var props = dom.attribs
  var children = []
  for (var i = 0, len = dom.children.length; i < len; i++) {
    var node = dom.children[i]
    // TEXT node
    if (node.type === 'text') {
      children.push(node.data)
    } else if (node.type === 'tag') {
      children.push(toVirtualDOM(node))
    }
  }
  children.forEach(function (child) {
    if (!child) {
      console.log('fuck', children)
    }
  })
  return el(tagName, props, children)
}

module.exports = h2v
