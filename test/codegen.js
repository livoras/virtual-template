var Parser = require('../src/parser')
var util = require('util')
var fs = require('fs')
var vTemplate = require('../src/virtual-template')
var util = require('util')

var str = fs.readFileSync('./fixtures/test1.html', 'utf-8')
var str2 = fs.readFileSync('./fixtures/test2.html', 'utf-8')
var str3 = fs.readFileSync('./fixtures/test3.html', 'utf-8')

describe('Test for walk through the AST', function () {
  it('walk walk walk', function () {
    var tpl = vTemplate.compile(str3)
    var el = tpl({
        isAdmin: true,
        users: [
            {
                id: 1,
                name: 'Jerry',
                isVIP: false,
                desc: "I love tomy"
            },
            {
                id: 2,
                name: 'Tomy',
                isVIP: true,
                desc: "fuck off, jerry"
            },
            {
                id: 3,
                name: 'Lucy',
                isVIP: false,
                desc: "You both shut up!"
            }
        ]
    })
    console.log(util.inspect(el, false, null))
    // console.log('=======================================')
    // var root = (new Parser(str)).parse()
    // var codeGen = new Codegen(root)
    // console.log(codeGen.body);
    // console.log('=======================================')
    // var root = (new Parser(str2)).parse()
    // new Codegen(root)
    // console.log('=======================================')
    // var root = (new Parser(str3)).parse()
    // new Codegen(root)
  })
})
