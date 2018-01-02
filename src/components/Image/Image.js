var Component = require('../Component');
var createElement = require('../../utils/ComponentUtil').createElement;
var ObjectUtil = require('../../utils/ObjectUtil');

function Image() {
  return ObjectUtil.assign(Object.create(new Component()), {
    name: 'image',
    render: function (props) {
      var src = props.src;
      if (!src) {
        return null;
      }

      return createElement('img', { src: src });
    }
  });
}

module.exports = Image;
