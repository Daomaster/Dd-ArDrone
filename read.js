// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    led = new GPIO(18, 'out'),
    button1 = new GPIO(17, 'in', 'both');
    button2 = new GPIO(18, 'in', 'both');
	button3 = new GPIO(23, 'in', 'both');

 
button1.watch(function(err, value){
	if (value === 0) {
	console.log("Drone 1 goes up!");
	};
});

button2.watch(function(err, value){
	if (value === 0) {
	console.log("Drone 2 goes up!");
	};
});

button3.watch(function(err, value){
	if (value === 0) {
	console.log("Drone land goes up!");
	};
});