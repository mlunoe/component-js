var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Thumbnail() {
  return ObjectUtil.inherits({
    getView: function (props) {
      if (!props.src) {
        return '';
      }
      var classes = 'thumbnail';
      if (props.className) {
        classes += ' ' + props.className;
      }

      var dataIndex = '';
      if (props.index != null) {
        dataIndex = 'data-index="' + props.index + '" '
      }

      return (
        '<div class="' + classes + '">' +
          '<div ' +
            'class="fill-image" ' +
            dataIndex +
            'data-src="' + props.src + '" ' +
            'style="background-image: url(' + props.src + ')">' +
          '</div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = Thumbnail;
