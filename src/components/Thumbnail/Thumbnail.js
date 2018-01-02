var assign = require('../../utils/ObjectUtil').assign;
var Component = require('../Component');
var createElement = require('../../utils/ComponentUtil').createElement;

function Thumbnail() {
  return assign(Object.create(new Component()), {
    name: 'thumbnail',
    render: function (props) {
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

      var titleElm = null;
      if (title) {
        titleElm = createElement('p', { class: 'title' }, [createElement(title)]);
      }

      return (
        createElement('div', { class: classes, dataIndex: index }, [
          createElement('div', {
            class: 'fill-image',
            dataSrc: src,
            style: 'background-image: url(' + src + ')'
          }),
          titleElm
        ])
      );
    }
  });
}

module.exports = Thumbnail;
