var _ = require('./utils')
var h2v = require('./h2v')
var svd = require('simple-virtual-dom')

var diff = svd.diff
var patch = svd.patch

function makeTemplateClass (compileFn) {
  function VirtualTemplate (data) {
    this.data = data
    var domAndVdom = this.makeVirtualDOM()
    this.vdom = domAndVdom.vdom
    this.dom = domAndVdom.dom
    this.isDirty = false
    this.flushCallbacks = []
  }

  _.extend(VirtualTemplate.prototype, {
    compileFn: compileFn,
    setData: setData,
    makeVirtualDOM: makeVirtualDOM,
    flush: flush
  })

  return VirtualTemplate
}

function setData (data, isSync) {
  _.extend(this.data, data)
  if (typeof isSync === 'boolean' && isSync) {
    this.flush()
  } else if (!this.isDirty) {
    this.isDirty = true
    var self = this
    // cache all data change, and only refresh dom before browser's repainting
    _.nextTick(function () {
      self.flush()
    })
  }
  if (typeof isSync === 'function') {
    var callback = isSync
    this.flushCallbacks.push(callback)
  }
}

function flush () {
  // run virtual-dom algorithm
  var newVdom = this.makeVirtualDOM().vdom
  var patches = diff(this.vdom, newVdom)
  patch(this.dom, patches)
  this.vdom = newVdom
  this.isDirty = false
  var callbacks = this.flushCallbacks
  for (var i = 0, len = callbacks.length; i < len; i++) {
    if (callbacks[i]) {
      callbacks[i]()
    }
  }
  this.flushCallbacks = []
}

function makeVirtualDOM () {
  var html = this.compileFn(this.data)
  return h2v(html)
}

module.exports = function (compileFn, data) {
  var VirtualTemplate = makeTemplateClass(compileFn)
  return data
    ? new VirtualTemplate(data)
    : VirtualTemplate
}
