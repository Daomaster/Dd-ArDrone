
var Gpio = require("onoff").Gpio,

	button1 = new Gpio(2, 'in', 'both'),
	button2 = new Gpio(3, 'in', 'both'),
	button3 = new Gpio(4, 'in', 'both'),

	led1 = new Gpio(14, 'out'),
	led2 = new Gpio(15, 'out'),
	led3 = new Gpio(18, 'out'),
	
	button4 = new Gpio(17, 'in', 'both'),
	button5 = new Gpio(27, 'in', 'both'),
	button6 = new Gpio(22, 'in', 'both'),

	led4 = new Gpio(23, 'out'),
	led5 = new Gpio(24, 'out'),
	led6 = new Gpio(10, 'out');

var buttons = [button1, button2, button3, button4,button5,button6];
var leds = [led1, led2, led3, led4, led5,led6];


 button1.watch(function(err, value) {
  if(value === 0){
  	console.log('Button1 Off');
  	  led1.writeSync(1);
  }
  else{
  	console.log('Button1 on');
  	  led1.writeSync(0);
  }
});

 button2.watch(function(err, value) {
  if(value === 0){
  	console.log('Button2 Off');
  	  led2.writeSync(1);
  }
  else{
  	console.log('Button2 on');
  	  led2.writeSync(0);
  }
});

 button3.watch(function(err, value) {
  if(value === 0){
  	console.log('Button3 Off');
  	  led3.writeSync(1);
  }
  else{
  	console.log('Button3 on');
  	  led3.writeSync(0);
  }
});
