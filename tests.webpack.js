var context = require.context('./app/__tests__', true, /\.(js|jsx)$/);
context.keys().forEach(context);
