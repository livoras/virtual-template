var interplationOpen = '{{'
var interplationClose = '}}'

var interReg = new RegExp('^' + interplationOpen + '[\\S\\s]+?' + interplationClose)

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
  var count = 0
  while (count !== 100) {
    // console.log(info.input)
    count++
    readBlank(info) ||
    readTag(info) ||
    readOpenTagRight(info) ||
    readCloseTag(info) ||
    readInterplation(info) ||
    readAttr(info) ||
    readText(info)
  }
}

function consume (info, length) {
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

function readAttr (info) {
  var lastGuard = getLastGuard(info)
  var matches = info.input.match(/^([\w\d\_\-]+\s*=\s*[^\>\s]+)|([\w\d_-]+)/)
  if (
    matches && (
      lastGuard === 'tag' ||
      lastGuard === 'attribute'
    )
  ) {
    var kv = matches[0].split('=')
    var key = trim(kv[0])
    var value = trim(kv[1])
    info.tokens.push({
      type: 'attribute',
      key: key,
      value: value
    })
    consume(info, matches[0].length)
    return true
  }
}

function trim(str) {
  if (str) {
    return str.replace(/^\s*|\s*$/g, '')
  }
}

function getLastGuard (info) {
  var i = info.tokens.length
  while(i--) {
    var token = info.tokens[i]
    if (
      token.type === 'tag' ||
      token.type === 'openTagRight' ||
      token.type === 'attribute' || 
      token.type === 'text' ||
      token.type === 'closeTag'
    ) return token.type
  }
}

function getLastToken (info) {
  return info.tokens[info.tokens.length - 1]
}

function readOpenTagRight (info) {
  var lastGuard = getLastGuard(info)
  if (lastGuard === 'attribute' || lastGuard === 'tag') {
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
