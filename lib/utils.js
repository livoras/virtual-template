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

module.exports = _
