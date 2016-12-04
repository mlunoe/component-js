var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Thumbnail() {
  return ObjectUtil.inherits({
    getView: function () {
      if (!this.props.src) {
        return '';
      }
      var classes = 'thumbnail';
      if (this.props.className) {
        classes += ' ' + this.props.className;
      }

      var dataIndex = '';
      if (this.props.index != null) {
        dataIndex = 'data-index="' + this.props.index + '" '
      }

      return (
        '<div class="' + classes + '">' +
          '<div ' +
            'class="fill-image" ' +
            dataIndex +
            'data-src="' + this.props.src + '" ' +
            'style="background-image: url(' + this.props.src + ')">' +
          '</div>' +
        '</div>'
      );
    }
  }, Component);
}

module.exports = Thumbnail;
