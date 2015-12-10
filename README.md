virtual-template
==============================
[![build](https://circleci.com/gh/livoras/virtual-template/tree/master.png?style=shield)](https://circleci.com/gh/livoras/virtual-template?branch=artTemplate) 
[![codecov.io](https://codecov.io/github/livoras/virtual-template/coverage.svg?branch=artTemplate)](https://codecov.io/github/livoras/virtual-template?branch=artTemplate) 
[![Dependency Status](https://david-dm.org/livoras/virtual-template.svg)](https://david-dm.org/livoras/virtual-template)
[![npm version](https://badge.fury.io/js/virtual-template.svg)](https://badge.fury.io/js/virtual-template) 

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Install

```html
<script src="your-template-engine.js"></script>
<script src="virtual-template/dist/virtual-template.min.js"></script>
```

## How to use

HTML:

```html
<script id="user" type="text/template">
  <h1>{firstName + ' ' + lastName}</h1>
  <ul>
    {each tags as value i}
      {if i % 2 == 0}
        <li style='color: red'>索引 {i + 1} ：{value}</li>
      {else}
        <li style='color: blue'>索引 {i + 1} ：{value}</li>
      {/if}
    {/each}
  </ul>
</script>

<script>
  // 构建渲染函数
  var userTpl = document.getElementById('user').innerHTML
  var userCompiler = template.compile(userTpl)
</script>
```

### 方式一：单个模版实例

```javascript
// 用渲染函数构建虚拟模版实例
var user = vTemplate(userCompiler, {
  firstName: 'Jerry',
  lastName: 'Green',
  tags: ['文艺', '博客', '摄影', '电影', '民谣', '旅行', '吉他']
})

// 把DOM插入文档中
document.body.appendChild(user.dom)

setTimeout(function () {
  // 一秒以后改变firstName状态，DOM会跟着改变
  user.setData({
    firstName: 'Tomy'
  })
}, 1000)
```

### 方式二：多个模板实例
```javascript
// 用渲染函数构建虚拟模版类
var User = vTemplate(userCompiler)

var jerry = new User({
  firstName: 'Jerry',
  lastName: 'Green',
})

var lucy = new User({
  firstName: 'Lucy',
  lastName: 'Green',
})

// 把DOM插入文档中
document.body.appendChild(jerry.dom)
document.body.appendChild(lucy.dom)

setTimeout(function () {
  jerry.setData({
    firstName: 'Tomy'
  })
  lucy.setData({
    lastName: 'Blue'
  })
}, 1000)
```

详细例子可以查看`example`目录。

## API

### vTemplate(compileFunction, data)

接收一个渲染函数和渲染数据，返回一个虚拟模版实例。实例包含一个`dom`和`setData`方法，`dom`为由渲染函数和数据渲染出来的真实的DOM。数据变更的时候通过`setData`方法改变数据状态，`dom`也会同步更新。

### vTemplate(compileFunction)

接收一个渲染函数，返回一个虚拟模版类，可以通过该类构建多个互不影响虚拟模版实例。

```javascript
var User = vTemplate(userCompiler)

var jerry = new User({
  firstName: 'Jerry',
  lastName: 'Green',
})

var lucy = new User({
  firstName: 'Lucy',
  lastName: 'Green',
})

jerry.setData({
  firstName: 'Tomy'
})
```

### setData(data)
虚拟模版实例的方法，传入的data会extend（浅复制）到原来的旧的data上。然后会用新的data渲染HTML，从而构建virtual dom。新的virtual dom会和旧的virtual dom进行对比，跑一次 Virtual-DOM 算法，更新真正的DOM。

## Contribution


安装全局依赖：

    npm install browserify standard nodemon mocha istanbul uglify-js -g


clone源码：

    git clone https://github.com/livoras/virtual-template.git

安装开发时依赖：

    cd virtual-template && npm install

开发运行时：

    npm run dev

然后可以修改源码，编写单元测试。

打包编译：

    npm run build

## License
The MIT License (MIT)

Copyright (c) 2015 Livoras

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




