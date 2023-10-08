/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1696649713760_880';

  // add your middleware config here
  config.middleware = [];

  config.multipart = {
    mode: 'file',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    security: {
      csrf: {
        enable: false,
      },
      domainWhiteList: [ '*' ],
    },
    cors: {
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
    ...config,
    ...userConfig,
  };
};
