
var Gpio = require("onoff").Gpio,

  button1 = new Gpio(2, 'in', 'both'),
  button2 = new Gpio(3, 'in', 'both'),
  button3 = new Gpio(4, 'in', 'both'),

  led1 = new Gpio(17, 'out'),
  led2 = new Gpio(27, 'out'),
  led3 = new Gpio(22, 'out');


button1.watch(function(err, value) {
  if(value === 1){
  	console.log('Button1 Off');
  	  led1.writeSync(0);
  }
  else{
  	console.log('Button1 on');
  	  led1.writeSync(1);
  }
});

 button2.watch(function(err, value) {
  if(value === 1){
  	console.log('Button2 Off');
  	  led2.writeSync(0);
  }
  else{
  	console.log('Button2 on');
  	  led2.writeSync(1);
  }
});

 button3.watch(function(err, value) {
  if(value === 1){
  	console.log('Button3 Off');
  	  led3.writeSync(0);
  }
  else{
  	console.log('Button3 on');
  	  led3.writeSync(1);
  }
});
