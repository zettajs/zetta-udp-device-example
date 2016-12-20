var dgram = require('dgram');
var util = require('util');
var Scout = require('zetta-scout');
var Led = require('./led');
var Photocell = require('./photocell');

var Drivers = {
  'led': Led,
  'photocell': Photocell
};

var UDPScout = module.exports = function() {
  Scout.call(this);
}
util.inherits(UDPScout, Scout);

UDPScout.prototype.init = function(next) {
  var self = this;
  var deviceCache = {}; // <deviceId>: driverInstance

  var server = dgram.createSocket('udp4');
  server.on('listening', function () {
    var address = server.address();
    server.setBroadcast(true);
    next();
  });

  server.on('message', function (message, rinfo) {
    var msg = JSON.parse(message);
    if (msg.type === 'discovery') {

      // Only look for devices we have a driver for
      var Driver = Drivers[msg.deviceType];
      if (!Driver) {
        return;
      }
      
      // Find a device that has deviceId that matches the messages deviceId
      // We CANNOT use `id` here because zetta generates a unique uuid for id per device
      var query = self.server.where({ type: msg.deviceType, deviceId: msg.deviceId });
       self.server.find(query, function(err, results) {
         if (results.length > 0) {
           // found in registry, tell zetta it came online
           var device = self.provision(results[0], Driver, msg, rinfo);
         } else {
           // does not exist in registry, discover a new one.
           var device = self.discover(Driver, msg, rinfo);
         }
         // self.provision will return null if the device is already inititated.
         // so we must check if we have a device.
         if (device) {
           // Save to cache so we don't have to do a disk lookup of the driver instance
           deviceCache[msg.deviceId] = device;
         }
       });
    } else if (msg.type === 'sensorReading') {
      // Check device cache if we've already setup driver just pass the data to it.
      if (deviceCache[msg.deviceId] && deviceCache[msg.deviceId].type === 'photocell') {
        deviceCache[msg.deviceId]._onData(msg);
        return;
      }
    }
  });

  server.bind(41414)
};
