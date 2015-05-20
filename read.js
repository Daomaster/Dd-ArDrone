var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(17, gpio.DIR_IN);
gpio.setup(18, gpio.DIR_IN);
gpio.setup(23, gpio.DIR_IN);