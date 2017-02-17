var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.inherits({
    getView: function () {
      var src = this.props.src;
      if (!src) {
        return '';
      }

      return (
        '<img src="' + src + '" />'
      );
    }
  }, Component);
}

module.exports = Image;
