Slack Assignment
===

### Usage

Built with node v4.4.4 and npm v3.9.1.
Tested on Chrome v50.0.2661,  Firefox v46.0.1, Safari v9.1.1 and IE11

```
npm install && npm start
open http://localhost:8080
```

See it running here [https://mlunoe.github.io/slack-assignment](https://mlunoe.github.io/slack-assignment/)

### Limitations
- If screen gets too wide compared to width (image ratio is 9/16), the image gets cut off at the bottom
- Image that does not follow the 9/16 ratio gets cut off to fit the ratio, in order to make the elements look nice
- IE overflows the grid, because of scrollbar
- Missing to handle loading and errors for the image viewer, and thumbnail grid
- Only a few essential parts of the app have been tested, like the Component, EventEmitter and ObjectUtil, but a lot of the visual parts needs tests
- Using JSONP, which is a hacky way of working around cross origin issues (it also has the problem of not being cancellable). This app should really have its own server to request content from.

### Focus:
- I decided to heavily focus on building out a modular app structure with self-contained components
- The main building blocks of the app is the Component, EventEmitter, ObjectUtil, ImageGrid and ImageViwer

### Features
- The page displays images from the Flickr feed
- Typing something in the search bar will display images from that search
- Clicking an image opens the lightbox/image viwer
- When the image viewer is open you can click the arrows at the bottom to navigate back and forth, or use the left and right arrow keys
- When the image viewer is open you can click close button (×) to close the modal, or use the esc key
