var Component = require('../Component/Component');

var Button = (function () {
  var count = 0;
  var counterID;

  return Object.assign({
    componentDidMount(element) {
      element.onclick = this.handleClick;
    },

    handleClick(e) {
      console.log(e);
    },

    getView() {
      return (
        '<button class="btn btn-success pull-right">' +
          'Click me!' +
        '</button>'
      );
    }
  }, new Component());
});

module.exports = Button;
