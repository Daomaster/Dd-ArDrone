// button 1 is GPIO17
// button 2 is GPIO18
// button 3 is GPIO23
var GPIO = require('onoff').Gpio,
    button1 = new GPIO(17, 'in', 'both');
    button2 = new GPIO(18, 'in', 'both');
	button3 = new GPIO(23, 'in', 'both');
	led1 = new GPIO(22,'out');
	led2 = new GPIO(24,'out');
	led3 = new GPIO(27,'out');
//Import the node.js lib
var arDrone = require('ar-drone');

//Drone 1 is probe 200   
var drone1 = arDrone.createClient({ip: '192.168.1.200'});   
//Before it take of flast trim the ground first
drone1.ftrim();                 
drone1.config('general:navdata_demo', 'TRUE');

//Drone 1 takes off and 4 secs later Drone 2 take off
	console.log('drone Takeoff!');
    drone.takeoff();
    drone.stop();
//Now the GPIO takes over the control by watch() function
//Sychronized function so paralle 

button1.watch(function(err, value){// for the pin 17 (up)
// Drone 1 up function
	if (value === 0) {
	led1.writeSync(1);
	console.log("Drone 1 goes up!");
	//Drone go up in 80% speed for .3 sec
	drone.up(0.8);  



    setTimeout(function(){ 
                          drone.stop();
                          console.log("Stop: 1");
                         }, 300);   
	}	else{
	led1.writeSync(0);
	}
	else{
	led1.writeSync(0);
	}
	

});

button2.watch(function(err, value){
// Drone 2 up function

	if (value === 0) {
	led2.writeSync(1);
	console.log("Drone 2 goes up!");
	//Drone go up in 80% speed for .3 sec
	drone.up(0.8);  
    setTimeout(function(){ 
                          drone.stop();
                          console.log("Stop: 2");
                         }, 300);   
	}
	else{
	led2.writeSync(0);
	}	
	
});

button3.watch(function(err, value){
// Fleet land function
	
	if (value === 0) {
	led3.writeSync(1);
	console.log("Fleet landing!");
	//The whole fleet will land after button3 is pressed
      drone.stop();
      drone.land();
	}
	else{
	led3.writeSync(0);
	}
});