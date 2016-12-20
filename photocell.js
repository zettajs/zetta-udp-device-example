var util = require('util');
var Device = require('zetta-device');

var Photocell = module.exports = function(opts, rinfo) {
  Device.call(this);
  this.lux = NaN;
  this.deviceId = opts.deviceId;
};
util.inherits(Photocell, Device);

Photocell.prototype.init = function(config) {
  config
    .type('photocell')
    .monitor('lux');
};

Photocell.prototype._onData = function(msg) {
  if (msg.data.type === 'lux') {
    this.lux = msg.data.value;
  }
};

