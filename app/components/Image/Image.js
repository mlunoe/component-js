var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.inherits({
    getView: function (props) {
      if (!props.src) {
        return '';
      }

      return (
        '<img src="' + props.src + '" />'
      );
    }
  }, Component);
}

module.exports = Image;
