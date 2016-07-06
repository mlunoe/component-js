Image Viewer App
===

### Usage

Built with node v4.4.4 and npm v3.9.1.
Tested on Chrome v50.0.2661,  Firefox v46.0.1, Safari v9.1.1 and IE11

```
npm install && npm start
open http://localhost:8080
```

### What is this?
- An image viewer application used as basis to built out a modular application strcuture in plain JavaScript as an experiment to learn something more about JavaScript

### Focus:
- The focus of this application is on building out a modular application structure with self-contained components
- The main building blocks of the app is the Component, EventEmitter, ObjectUtil, ImageGrid and ImageViwer

### Limitations
- This application is built using only ES5, without Babel polyfill or any JavaScript framework or libraries
- There is still some polish left to do there for it to be super appealing visually
- Only a few essential parts of the app have been tested, like the Component, EventEmitter and ObjectUtil, but a lot of the visual parts needs tests
- Using JSONP, which is a hacky way of working around cross origin issues (it also has the problem of not being cancellable). This app should really have its own server to request content from
- Missing to handle loading and errors for the image viewer, and thumbnail grid
- If screen gets too wide compared to width (image ratio is 9/16), the image gets cut off at the bottom
- Image that does not follow the 9/16 ratio gets cut off to fit the ratio, in order to make the elements look nice
- IE overflows the grid, because of scrollbar

### Features
- The page displays images from the Flickr feed
- Typing something in the search bar will display images from that search
- Clicking an image opens the image viewer modal
- When the modal is open you can click the arrows at the bottom to navigate back and forth, or use the left and right arrow keys
- When the modal is open you can click close button (×) to close the modal, or use the esc key
