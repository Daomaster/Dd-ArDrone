// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    led = new GPIO(18, 'out'),
    button1 = new GPIO(17, 'in', 'both');
    button2 = new GPIO(18, 'in', 'both');
	button3 = new GPIO(23, 'in', 'both');

 
button1.watch(function(err, value){
	console.log("Pin 17 is " + value);
});

button2.watch(function(err, value){
	console.log("Pin 18 is " + value);
});

button3.watch(function(err, value){
	console.log("Pin 23 is " + value);
});