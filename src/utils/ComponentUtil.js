var assign = require('./ObjectUtil').assign;
var Component = require('../components/Component');

var tagNames = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nextid', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'slot', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp'];

function createBaseComponent(type) {
  return assign(Object.create(new Component()), {
    name: type,
    render: function () {
      var tagName = type.toLowerCase();
      if (tagNames.includes(tagName)) {
        return global.document.createElement(type);
      }
      return global.document.createTextNode(type);
    }
  });
}

var ComponentUtil = {
  /**
   * @param {String|Component} component or type to render
   * @param {Object} props properties for component
   * @param {<HTMLElement>[]?} children nested components
   * @return {HTMLElement}      rendered component
   */
  createElement: function (componentOrType, propsOrNull, children) {
    var props = propsOrNull || {};
    var component = componentOrType;
    if (typeof componentOrType === 'string') {
      component = createBaseComponent(componentOrType);
    }
    if (typeof children === 'object' && children.length) {
      assign(props, { children: children });
    }
    component.setProps(props);
    component.forceUpdate();

    return component.getElement();
  }
};

module.exports = ComponentUtil;
