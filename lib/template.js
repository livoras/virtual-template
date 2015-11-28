var tokenizer = require('./tokenizer')

function render (html) {
  tokenizer(html)
}

module.exports = {
  name: 'virtual-template',
  render: render
}
