var interplationOpen = "{{"
var interplationClose = "}}"

module.exports = function (input) {
  var info = {
    tokens: [],
    input: input,
    rawInput: input
  }
  getTokens(info)
  return info.tokens
}

function getTokens (info) {
  var count = 0;
  while(count != 40) {
    // console.log(info.input)
    count++
    readBlank(info) ||
    readTag(info) ||
    readOpenTagRight(info) ||
    readAttrs(info) ||
    readInterplation(info) ||
    readCloseTag(info) ||
    readText(info)
  }
  console.log(info.input)
}

function consume(info, length) {
  info.input = info.input.substr(length)
}

function readBlank (info) {
  var blanks = info.input.match(/^\s+/)
  if (blanks) {
    consume(info, blanks[0].length)
    return true
  }
}

function readTag (info) {
  var tags = info.input.match(/^\<[ \t]*([\w\d\-]+)/)
  if (tags) {
    info.tokens.push({
      type: 'tag',
      tagName: tags[1]
    })
    consume(info, tags[0].length)
    return true
  }
}

function readAttrs (info) {
  var lastToken = getLastToken(info)
  if (lastToken && lastToken.type === "tag") {
    var attr = info.input.match(/^[\S\s]+?\>/)
    if (attr) {
      var attrs = attr[0].replace(/\>$/, '').split(/\s+/g)
      var attrsList = []
      for (var i = 0, len = attrs.length; i < len; i++) {
        var currentAttr = attrs[i].split('=')
        attrsList.push({
          key: currentAttr[0],
          value: currentAttr[1]
        })
      }
      info.tokens.push({
        type: 'attributes',
        attributes: attrsList
      })
      consume(info, attr[0].length - 1)
      return true
    }
  }
}

function getLastToken (info) {
  return info.tokens[info.tokens.length - 1]
}

function readOpenTagRight (info) {
  var lastToken = getLastToken(info)
  if (lastToken && (lastToken.type === 'tag' || lastToken.type === 'attributes')) {
    var matches = info.input.match(/^\/?\>/)
    if (matches) {
      info.tokens.push({type: 'openTagRight'})
      consume(info, matches[0].length)
      return true
    }
  }
}

function readText (info) {
  var reg = new RegExp('^([\\s\\S]+?)' + '(' + interplationOpen + '|\\<)') // may have bug: "{{fd}}"
  var matches = info.input.match(reg)
  if (matches) {
    info.tokens.push({
      type: 'text',
      text: matches[1]
    })
    consume(info, matches[1].length)
    return true
  }
}

function readInterplation (info) {
  var interReg = new RegExp('^' + interplationOpen + '[\\S\\s]+?' + interplationClose)
  var matches = info.input.match(interReg)
  if (matches) {
    info.tokens.push({
      type: 'interplation',
      value: matches[0]
    })
    consume(info, matches[0].length)
    return true
  }
}

function readCloseTag (info) {
  var matches = info.input.match(/^\<\s*?\/\s*?([\w\d\-]+?)\>/)
  if (matches) {
    info.tokens.push({
      type: 'closeTag',
      tag: matches[1]
    })
    consume(info, matches[0].length)
    return true
  }
}
