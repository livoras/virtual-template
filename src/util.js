var _ = {}

_.each = function (list, callback) {
  for (var i = 0, len = list.length; i < len; i++) {
    callback(list[i], i)
  }
}

module.exports = _
