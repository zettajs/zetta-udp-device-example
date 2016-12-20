var zetta = require('zetta');
var UDPScout = require('../scout');


zetta()
  .use(UDPScout)
  .listen(3000)
