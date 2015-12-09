/**
 * Convert HTML string to simple-virtual-dom
 */

var svd = require('simple-virtual-dom')
var el = svd.el

function h2v (html) {
  var root = document.createElement('div')
  root.innerHTML = html
  root = (root.childNodes.length === 1)
    ? root.childNodes[0]
    : root
  return toVirtualDOM(root)
}

function toVirtualDOM (dom) {
  var tagName = dom.tagName.toLowerCase()
  var props = attrsToObj(dom)
  var children = []
  for (var i = 0, len = dom.childNodes.length; i < len; i++) {
    var node = dom.childNodes[i]
    // TEXT node
    if (node.nodeType === 3) {
      if (node.nodeValue) {
        children.push(node.nodeValue)
      } else {
        children.push(node.textContent)
      }
    } else {
      children.push(toVirtualDOM(node))
    }
  }
  return el(tagName, props, children)
}

function attrsToObj (dom) {
  var attrs = dom.attributes
  var props = {}
  for (var i = 0, len = attrs.length; i < len; i++) {
    var name = attrs[i].name
    var value = attrs[i].value
    // TODO: fix IE style string.
    props[name] = value
  }
  return props
}

module.exports = h2v
