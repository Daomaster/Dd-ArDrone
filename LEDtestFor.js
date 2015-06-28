
var Gpio = require("onoff").Gpio,
	//DD1
	button1 = new Gpio(2, 'in', 'both'),
	button2 = new Gpio(3, 'in', 'both'),
	button3 = new Gpio(4, 'in', 'both'),

	led1 = new Gpio(14, 'out'),
	led2 = new Gpio(15, 'out'),
	led3 = new Gpio(18, 'out'),

	//DD2
	button4 = new Gpio(17, 'in', 'both'),
	button5 = new Gpio(27, 'in', 'both'),
	button6 = new Gpio(22, 'in', 'both'),

	led4 = new Gpio(23, 'out'),
	led5 = new Gpio(24, 'out'),
	led6 = new Gpio(10, 'out');


var buttons = [button1, button2, button3, button4,button5,button6];
var leds = [led1, led2, led3, led4, led5,led6];


for(var i = 0; i <6; i++)
{
	buttons[i].watch(function(err, value){
		leds[i].writeSync(value);
	});
};
