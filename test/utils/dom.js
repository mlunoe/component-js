var jsdom = require('jsdom');

var JSDOM = jsdom.JSDOM;
// setup the simplest global.document possible

var win = (new JSDOM('<!doctype html><html><body></body></html>')).window;
global.document = win.document;
global.window = win.document.parentWindow;
