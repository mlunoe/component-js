var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Thumbnail() {
  return ObjectUtil.inherits({
    getView: function () {
      var props = this.props;
      var className = props.className;
      var index = props.index;
      var src = props.src;
      var title = props.title;

      if (!src) {
        return '';
      }
      var classes = 'thumbnail';
      if (className) {
        classes += ' ' + className;
      }

      var dataIndex = '';
      if (index != null) {
        dataIndex = 'data-index="' + index + '" '
      }

      var titleElm = '';
      if (title) {
        titleElm = '<p>' + title + '</p>';
      }

      return (
        '<div class="' + classes + '">' +
          '<div ' +
            'class="fill-image" ' +
            dataIndex +
            'data-src="' + src + '" ' +
            'style="background-image: url(' + src + ')">' +
          '</div>' +
          titleElm +
        '</div>'
      );
    }
  }, Component);
}

module.exports = Thumbnail;
