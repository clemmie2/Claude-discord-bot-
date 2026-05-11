const config = require("../config");

function isAllowedChannel(channelId) {
  if (!config.whitelist.enabled) return true;
  return config.whitelist.channels.includes(channelId);
}

module.exports = { isAllowedChannel };