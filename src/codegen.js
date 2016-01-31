var _ = require('./util')
var codeGenMethods = {}

function CodeGen (astRoot) {
  this.nodeIndex = 1
  this.lines = ['  var node0 = {children: []};']
  this.walkRoot(astRoot)
  this.lines.push('  return _el_("div", {}, node0.children);')
  this.body = this.lines.join('\n');
}

var pp = CodeGen.prototype

pp.walkRoot = function (astRoot) {
  this.walk(astRoot, '  ', '0')
}

pp.walk = function (node, indent, parentIndex) {
  if (typeof node === 'string') {
    return this.genString(node, indent, parentIndex)
  } else {
    return this['gen' + node.type](node, indent, parentIndex)
  }
}

pp.genStat = function (node, indent, parentIndex) {
  var self = this
  _.each(node.members, function (item) {
    self.walk(item, indent, parentIndex)
  })
}

pp.genIfStat = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*if\s*)|(\s*\}$)/g, '')
  this.lines.push('\n' + indent + 'if (' + expr + ') {')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
  if (node.elseifs) {
    var self = this
    _.each(node.elseifs, function (elseif) {
      self.walk(elseif, indent, parentIndex)
    })
  }
  if (node.elsebody) {
    this.lines.push(indent + '} else {')
    this.walk(node.elsebody, inc(indent), parentIndex)
  }
  this.lines.push(indent + '}\n')
}

pp.genElseIf = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*else\s*if\s*)|(\s*\}$)/g, '')
  this.lines.push(indent + '} else if (' + expr + ') {')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
}

pp.genEachStat = function (node, indent, parentIndex) {
  var expr = node.label.replace(/(^\{\s*each\s*)|(\s*\}$)/g, '')
  var tokens = expr.split(/\s+/)
  var list = tokens[0]
  var item = tokens[2]
  var key = tokens[3] || getKey()
  this.lines.push(
    '\n' +
    indent +
    'for (var ' + key + ' = 0, len = ' + list + '.length; ' + key + ' < len; ' + key + '++) {'
  )
  this.lines.push(inc(indent) + 'var ' + item + ' = ' + list + '[' + key + '];')
  if (node.body) {
    this.walk(node.body, inc(indent), parentIndex)
  }
  this.lines.push(indent + '}\n')
}

pp.genNode = function (node, indent, parentIndex) {
  var currentIndex = this.nodeIndex++
  var nodeName = 'node' + currentIndex
  this.lines.push(indent + 'var ' + nodeName + ' = {children: []};')
  if (node.body) {
    this.walk(node.body, indent, currentIndex)
  }
  this.lines.push(
    indent + nodeName + ' = _el_("' + node.name +
    '", ' + pp.getAttrs(node) + ', ' + nodeName + '.children);'
  )
  this.lines.push(
    indent +
    'node' + parentIndex + '.children.push(node' + currentIndex + ');'
  )
}

pp.genString = function (node, indent, parentIndex) {
  var line = indent + 'node' + parentIndex + '.children.push(' + getInterpolation(node) + ')'
  line = line.replace('\n', '\\n')
  this.lines.push(line)
}

pp.getAttrs = function (node) {
  var str = '{'
  var attrs = node.attributes
  var i = 0;
  for (var key in attrs) {
    var attrStr = getInterpolation(attrs[key])
    if (i++ != 0) {
      str += (', ' + key + ': ' + attrStr)
    } else {
      str += (key + ': ' + attrStr)
    }
  }
  str += '}'
  return str;
}

function inc (indent) {
  return indent + '  '
}

var keyIndex = 0

function getKey () {
  return 'key' + keyIndex++
}

function getInterpolation (node) {
  var reg = /\{[\s\S]+?\}/g
  var inters = node.match(reg)
  var strs = node.split(reg)
  if (!inters) return ['"', '"'].join(node)
  var last = strs[strs.length - 1]
  strs.splice(strs.length - 1, 1)
  var ret = ''
  _.each(strs, function (str, i) {
    ret += ('"' + str + '" + ')
    ret += (
      '(' + inters[i].replace(/[\{\}]/g, '') + ') + '
    )
  })
  ret += ('"' + last + '"')
  return ret
}

module.exports = CodeGen
