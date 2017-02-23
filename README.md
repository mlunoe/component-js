component.js
===

A minimal modular application structure (boilerplate) in plain JavaScript (ES5) for creating reusable components. The application is a small Image Viewer used as an example for testing the abilities and limitations of the main [Component.js](https://github.com/mlunoe/component-js/blob/master/src/components/Component/Component.js) and structure.

See [Component.js](https://github.com/mlunoe/component-js/blob/master/src/components/Component/Component.js) and an example usage here: [SearchBar.js](https://github.com/mlunoe/component-js/blob/master/src/components/SearchBar/SearchBar.js).

### Usage

Built with node v7.5.x and npm v4.1.x.
Tested on Chrome v56.0.2924.87, Firefox v49.0.1, Safari v10.0.2 and IE11

```
npm install && npm start
open http://localhost:8080
```

See it running here [http://mlunoe.github.io/component-js](http://mlunoe.github.io/component-js)

<img src="https://raw.githubusercontent.com/mlunoe/component-js/5b542c095ea3c70484f39da09a0724553f7f0603/screenshots/image-viewer.png" width="75%" />

Example usage of [Component.js](https://github.com/mlunoe/component-js/blob/master/src/components/Component/Component.js):
```js
var Component = require('../Component/Component');
var ObjectUtil = require('./utils/ObjectUtil');

module.exports = function MyComponent() {
  // Private scope

  return ObjectUtil.assign(Object.create(new Component()), {
    componentWillMount(props) {
      // Do something with props before mount
    },

    componentDidMount(element, props) {
      // Do something with element and props after mount
    },

    componentWillUpdate(element, props) {
      // Do something with element and props before update
    },

    componentDidUpdate(element, props) {
      // Do something with element and props on update
    },

    componentWillUnmount(element, props) {
      // Clean up component with element and props
    },

    getView(props) {
      // Return string of component view
      return (
        '<div>' +
          'Example DIV' +
        '</div>'
      );
    }
  });
};

// Mount component
var container = global.document.createElement('div');
new MyComponent().render(container, {foo: 'bar'});
```

### Focus:
- The focus of this application is on building out a modular application structure with self-contained components
- The main building blocks of the app is the [Component.js](https://github.com/mlunoe/component-js/blob/master/src/components/Component/Component.js), [EventEmitter.js](https://github.com/mlunoe/component-js/blob/master/src/events/EventEmitter.js), [ObjectUtil.js](https://github.com/mlunoe/component-js/blob/master/src/utils/ObjectUtil.js) and [ComponentUtil.js](https://github.com/mlunoe/component-js/blob/master/src/utils/ComponentUtil.js).

### Limitations
- This application is built using only ES5, without Babel polyfill or any JavaScript framework or libraries
- There is still some polish left to do there for it to be super appealing visually
- Only a few essential parts of the app have supporting unit tests, like the Component, ImageGrid, EventEmitter and ObjectUtil, but a lot of the visual parts needs tests
- Using JSONP, which is a hacky way of working around cross origin issues (it also has the problem of not being cancellable). This app should really have its own server to request content from
- Missing to handle errors in the image viewer, and thumbnail grid
- Images that do not follow the 9/16 ratio get cut off in thumbnails to fit the ratio, in order to make the elements look nice
- IE overflows the grid, because of scrollbar

### Features
- The page displays images from the Flickr feed
- Typing something in the search bar will display images from that search
- Clicking an image opens the image viewer modal
- When the modal is open you can click the arrows at the bottom to navigate back and forth, or use the left and right arrow keys
- When the modal is open you can click close button (×) to close the modal, or use the esc key

### License
Copyright (c) 2016, [@mlunoe](https://github.com/mlunoe)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
