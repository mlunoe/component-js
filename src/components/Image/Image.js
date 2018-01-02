var assign = require('../../utils/ObjectUtil').assign;
var Component = require('../Component');
var createElement = require('../../utils/ComponentUtil').createElement;

function Image() {
  return assign(Object.create(new Component()), {
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
