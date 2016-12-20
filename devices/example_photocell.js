const dgram = require('dgram');

var deviceId = process.argv[2] || 1;

var client = dgram.createSocket('udp4');
client.bind(function() {
  client.setBroadcast(true);

  function sendDiscovery() {
    var message = JSON.stringify({ deviceId: deviceId, type: 'discovery', deviceType: 'photocell' });
    client.send(message, 0, message.length, 41414, '255.255.255.255');
  }

  setInterval(function() {
    sendDiscovery();
  }, 5000);
  sendDiscovery();

  setInterval(function() {
    var message = JSON.stringify({ deviceId: deviceId, type: 'sensorReading', deviceType: 'photocell', data: {
      type: 'lux',
      value: Math.random()*100
    } });
    client.send(message, 0, message.length, 41414, '255.255.255.255');
  }, 500)

});
