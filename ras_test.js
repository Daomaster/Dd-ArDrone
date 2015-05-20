var gpio = require('rpi-gpio');
var async = require('async');
 
gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
 
async.parallel([
    function(callback) {
        gpio.setup(23, gpio.DIR_IN, callback)
    },
    function(callback) {
        gpio.setup(17, gpio.DIR_IN, callback)
    },
    function(callback) {
        gpio.setup(18, gpio.DIR_IN, callback)
    },
], function(err, results) {
    console.log('Pins set up');
    read();
});
 
function read() {
    async.series([
        function(callback) {
            delayedRead(7, callback);
        },
        function(callback) {
            delayedRead(15, callback);
        },
        function(callback) {
            delayedRead(16, callback);
        },
        function(callback) {
            delayedRead(7, callback);
        },
        function(callback) {
            delayedRead(15, callback);
        },
        function(callback) {
            delayedRead(16, callback);
        },
    ], function(err, results) {
        console.log('Read complete, pause then unexport pins');
        setTimeout(function() {
            gpio.destroy(function() {
                console.log('Closed pins, now exit');
                return process.exit(0);
            });
        }, 500);
    });
};
 
function delayedRead(pin,callback) {
    setTimeout(function() {
        gpio.read(pin, callback);
    }, 500);
}