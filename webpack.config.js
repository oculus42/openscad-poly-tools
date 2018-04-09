const path = require('path');

const serverConfig = {
  target: 'node',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ospoly.node.js',
    libraryTarget: 'umd',
    library: 'ospoly',
  },
};

const clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  entry: './src/index-web.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ospoly.min.js',
    library: 'ospoly',
  },
};

module.exports = [serverConfig, clientConfig];
