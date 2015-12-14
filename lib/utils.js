var _ = {}

/**
 * Shallowly copy properties to object
 * @param {Object} dest
 * @param {Object} src
 * @return {Object} - The result of extending `src` to `dest`.
 */

_.extend = function (dest, src) {
  for (var key in src) {
    if (src.hasOwnProperty(key)) {
      dest[key] = src[key]
    }
  }
  return dest
}

if (process.env.NODE_ENV) {
  _.nextTick = process.nextTick
} else {
  var nextTick = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame

  if (nextTick) {
    _.nextTick = function () {
      nextTick.apply(window, arguments)
    }
  } else {
    _.nextTick = function (func) {
      // for IE, setTimeout is a cool object instead of function
      // so you cannot simply use nextTick.apply
      setTimeout(func)
    }
  }
}

module.exports = _
