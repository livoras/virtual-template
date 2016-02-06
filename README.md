virtual-template
=============================
[![build](https://circleci.com/gh/livoras/virtual-template/tree/dsl.png?style=shield)](https://circleci.com/gh/livoras/virtual-template) 

A simple template engine using virtual-dom. 

## Usage

HTML: 

```html
<script id="user" type="text/template">
  <h1>{firstName + ' ' + lastName}</h1>
  <ul>
    {each tags as value i}
      {if i % 2 == 0}
        <li style='color: red'>#{i + 1} ：{value}</li>
      {else}
        <li style='color: blue'>#{i + 1} ：{value}</li>
      {/if}
    {/each}
  </ul>
</script>
```

JavaScript:

```javascript
var userTplStr = document.getElementById('user').innerHTML

// compile template string to virtual-dom render function
var userTpl = vTemplate.compile(userTplStr)

// render initial DOM element
var jerry = userTpl({
  firstName: 'Jerry',
  lastName: 'Green',
  tags: ['JavaScript', 'Virtual-Template', 'Web']
})

// insert the real DOM element into document 
document.body.appendChild(jerry.dom)

// update dom with new data
setTimeout(function () {
  jerry.setData({
    firstName: 'Tomy',
    tags: ['C++', 'Python', 'C#']
  })
}, 1000)
```

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