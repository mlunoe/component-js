var Component = require('../Component/Component');
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.assign(Object.create(new Component()), {
    getView: function (props) {
      if (!props.src) {
        return '';
      }

      return (
        '<div ' +
          'class="fill-image" ' +
          'data-index="' + props.index + '" ' +
          'data-src="' + props.src + '" ' +
          'style="background-image: url(' + props.src + ')">' +
        '</div>'
      );
    }
  });
}

module.exports = Image;
