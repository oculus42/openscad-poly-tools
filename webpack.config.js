const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'ospoly.min.js',
    library: 'ospoly',
  },
};
