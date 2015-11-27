var fs = require('fs')
var html = fs.readFileSync('./test/test.html', 'utf-8')
var tokenizer = require('./lib/tokenizer')

var tokens = tokenizer(html)
console.log(tokens)
