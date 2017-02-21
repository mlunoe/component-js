var Component = require('../Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.assign(Object.create(new Component()), {
    getView: function (props) {
      var src = props.src;
      if (!src) {
        return '';
      }

      return (
        '<img src="' + src + '" />'
      );
    }
  });
}

module.exports = Image;
