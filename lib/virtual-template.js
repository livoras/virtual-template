var _ = require('./utils')
var h2v = require('./h2v')
var svd = require('simple-virtual-dom')

var diff = svd.diff
var patch = svd.patch

function makeTemplateClass (compileFn) {
  function VirtualTemplate (data) {
    this.data = data
    this.vdom = this.makeVirtualDOM()
    this.dom = this.vdom.render()
  }

  _.extend(VirtualTemplate.prototype, {
    compileFn: compileFn,
    setData: setData,
    makeVirtualDOM: makeVirtualDOM
  })

  return VirtualTemplate
}

function setData (data) {
  _.extend(this.data, data)
  var newVdom = this.makeVirtualDOM()
  var patches = diff(this.vdom, newVdom)
  patch(this.dom, patches)
  this.vdom = newVdom
}

function makeVirtualDOM () {
  var html = this.compileFn(this.data)
  var vdom = h2v(html)
  return vdom
}

module.exports = function (compileFn, data) {
  var VirtualTemplate = makeTemplateClass(compileFn)
  return data
    ? new VirtualTemplate(data)
    : VirtualTemplate
}
