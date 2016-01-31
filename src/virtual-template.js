var CodeGen = require('./codegen')
var Parser = require('./parser')
var svd = require('simple-virtual-dom')

var vTemplate = {}

vTemplate.compile = function (template) {
  var astRoot = (new Parser(template)).parse()
  var code = new CodeGen(astRoot)
  return function (data) {
    var params = []
    for (var key in data) {
      params.push('  var ' + key + ' = ' + '_data_.' + key + ';\n')
    }
    var body = params.join('') + code.body
    console.log(body)
    var renderFunc = new Function('_data_', '_el_', 'node_', body)
    var container = svd.el('div')
    renderFunc(data, svd.el, container)
    return (container.children.length === 1)
      ? container.children[0]
      : container
  }
}

module.exports = vTemplate
