var Component = require('../Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Thumbnail() {
  return ObjectUtil.assign(Object.create(new Component()), {
    getView: function (props) {
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
        titleElm = '<p class="title">' + title + '</p>';
      }

      return (
        '<div class="' + classes + '"' + dataIndex + '>' +
          '<div ' +
            'class="fill-image" ' +
            'data-src="' + src + '" ' +
            'style="background-image: url(' + src + ')">' +
          '</div>' +
          titleElm +
        '</div>'
      );
    }
  });
}

module.exports = Thumbnail;
