const config = require("../config/env");
const env = config.env;

/**
 * Boolean check is server production
 *
 * @constant
 * @type {function}
 *
 * @return - true if is production
 */
function isProd() {
  return env.isProduction;
}

/**
 * Boolean check is server development
 *
 * @constant
 * @type {function}
 *
 * @return - true is development
 */
function isDev() {
  return env.isDev;
}

module.exports = {
  isProd,
  isDev,
};
