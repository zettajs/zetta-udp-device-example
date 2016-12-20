const dgram = require('dgram');

var deviceId = process.argv[2] || 1;

const server = dgram.createSocket('udp4');
server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  var json = JSON.parse(msg);
  console.log(`Device: ${json.action} from ${rinfo.address}:${rinfo.port}`);
});

var client = dgram.createSocket('udp4');
client.bind(function() {
  client.setBroadcast(true);
});

server.bind(0, function(err) {
  var port = server.address().port;

  function sendDiscovery() {
    var message = JSON.stringify({ deviceId: deviceId, type: 'discovery', port: port, deviceType: 'led' });
    client.send(message, 0, message.length, 41414, '255.255.255.255');
  }

  setInterval(function() {
    sendDiscovery();
  }, 5000);
  sendDiscovery();
});
