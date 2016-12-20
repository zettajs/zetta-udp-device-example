var util = require('util');
var dgram = require('dgram');
var Device = require('zetta-device');

var Led = module.exports = function(opts, rinfo) {
  Device.call(this);
  this.deviceId = opts.deviceId;
  var client = dgram.createSocket('udp4');
  this._send = function(json, cb) {
    client.send(JSON.stringify(json), opts.port, rinfo.address, cb)
  };
};
util.inherits(Led, Device);

Led.prototype.init = function(config) {
  config
    .type('led')
    .state('off')
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .when('off', { allow: ['turn-on']})
    .when('on', { allow: ['turn-off']});
};

Led.prototype.turnOff = function(cb) {
  var self = this;
  this._send({action: 'turn-off'}, function(err) {
    if (err) {
      return cb(err);
    }

    self.state = 'off';
    cb();
  });
};

Led.prototype.turnOn = function(cb) {
  var self = this;
  this._send({action: 'turn-on'}, function(err) {
    if (err) {
      return cb(err);
    }

    self.state = 'on';
    cb();
  });
};
