var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.inherits({
    getView: function () {
      if (!this.props.src) {
        return '';
      }

      return (
        '<img src="' + this.props.src + '" />'
      );
    }
  }, Component);
}

module.exports = Image;
