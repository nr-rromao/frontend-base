const path = require('path');

module.exports = {
    entry: './assets/js/web-components-loaders/nr-smart-connection-loader.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};