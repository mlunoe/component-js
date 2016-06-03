var Component = require('../Component/Component');
var Image = require('../Image/Image');
var ObjectUtil = require('../../utils/ObjectUtil');

function Thumbnail() {
  var image = new Image();

  return ObjectUtil.assign(Object.create(new Component()), {
    componentDidMount: function (element, props) {
      image.render(element, props);
    },

    getView(props) {
      return (
        '<div class="thumbnail"></div>'
      );
    }
  });
}

module.exports = Thumbnail;
