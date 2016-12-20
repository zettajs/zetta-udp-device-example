# Example Zetta UDP Scout

The devices broadcast a UDP discovery packet on `41414` to `255.255.255.255`. The led also listens on a random udp and broadcasts that port with the discovery packet to tell the the client which port to send the actions to.

The scout runs the udp server on the port and listens for packets, once it gets a message it tries to find the device by `deviceId` in the registry or create a new one if it's the first time seeing it. It also stores the device instances after created with either `discover` or `provision` in order to forward the actual data to the device instance.

## Running example

```
 npm install
 node example/server.js &

 # Start 3 devices
 node devices/example_led.js 1 &
 node devices/example_led.js 2 &
 node devices/example_photocell.js 3 &
```

Open zetta browser

[http://browser.zettajs.io/#/overview?url=http:%2F%2Flocalhost:3000](http://browser.zettajs.io/#/overview?url=http:%2F%2Flocalhost:3000)
