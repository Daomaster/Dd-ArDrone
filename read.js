var gpio = require('rpi-gpio');
 
gpio.setup(17, gpio.DIR_IN, readInput);
 
function readInput() {
    gpio.read(17, function(err, value) {
        console.log('The value is ' + value);
    });
}