
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
	led6 = new Gpio(10, 'out'),

	//DD3
	button7 = new Gpio(11, 'in', 'both'),
	button8 = new Gpio(8, 'in', 'both'),
	button9 = new Gpio(7, 'in', 'both'),

	led7 = new Gpio(16, 'out'),
	led8 = new Gpio(20, 'out'),
	led9 = new Gpio(21, 'out');

var buttons = [button1, button2, button3, button4,button5,button6,button7,button8,button9];
var leds = [led1, led2, led3, led4, led5,led6,led7,led8,led9];

for(var i =0; i<9;i++)
{
 button[i].watch(function(err,value){
 	led[i].writeSync(value);
 });
}
