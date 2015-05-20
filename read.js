var gpio = require('rpi-gpio');

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(11, gpio.DIR_IN);
gpio.setup(12, gpio.DIR_IN);
