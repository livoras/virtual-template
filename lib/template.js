var tokenizer = require('./tokenizer')
var parser = require('./parser')

function render (html) {
  var tokens = tokenizer(html)
  var vdFunc = parser(tokens)
  console.log(vdFunc)
}

module.exports = {
  name: 'virtual-template',
  render: render
}
