//Declaring packages used

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

var fleet = [dd1,dd2,dd3];
var target = [100,120,140];
var target1 = [button1,button4,button7];
var target2 = [button2,button5,button8];
var target3 = [button3,button6,button9];
var buttonMatrix = [target1,target2,target3];
var initButton = function(){
for (var i = 0; i <= 2; i++) {
	for (var j = 0; j <=2 ; j++) {
				
		buttonMatrix[i][j].watch(function(err, value){
			if (value === 0) {
			console.log("Drone "+(j+1)+" :target "+target[i]+"cm!");
			fleet[j+1].target = target[i];
			climb(fleet[j+1].controller,fleet[j+1].target);
			fleet[j+1]
			};
		});
	}	
}
}
