const blacklist = require('react-native/packager/blacklist');

const config = {
  getBlacklistRE(platform) {
    return blacklist(platform, [
      /node_modules\/react-native-router\/node_modules\/.*/
    ]);
  }
};

module.exports = config;
