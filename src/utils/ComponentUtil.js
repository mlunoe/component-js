var ComponentUtil = {
  /**
   * Renders mulitple components into one element using a DocumentFragment
   * @param  {Array<Function>} renderList list of render functions to get called
   * iteratively with DocumentFragment to be rendered in
   * @param  {HTMLElement} element to render list in
   */
  renderMultiple: function (renderList, element) {
    var docFrag = global.document.createDocumentFragment();
    renderList.forEach(function (render, index) {
      // Separate if-statement so Webpack knows to remove in production
      if (process.env.NODE_ENV !== 'production') {
        if (typeof render !== 'function') {
          throw new Error('Render item number ' + index + ' in list was not a function. Please provide a function for each item in list to render.');
        }
      }

      render(docFrag, index);
    });

    element.appendChild(docFrag);
  }
};

module.exports = ComponentUtil;
