// button 1 is GPIO17
// button 2 is GPIO18
// button 3 is GPIO23
var GPIO = require('onoff').Gpio,
    button1 = new GPIO(17, 'in', 'both');
    button2 = new GPIO(18, 'in', 'both');
	button3 = new GPIO(23, 'in', 'both');
//Import the node.js lib
var arDrone = require('ar-drone');

//Global varible for drones
var onAir1 = false;
var onAir2 = false;

//Drone 1 is probe 200   
var drone1 = arDrone.createClient({ip: '192.168.1.200'}); 
//Drone 2 is probe 202
var drone2 = arDrone.createClient({ip: '192.168.1.202'}); 
//Fleet is the array of the drone
var fleet = [drone1,drone2];   
//Before it take of flast trim the ground first
fleet.forEach(function(drone)
{
	drone.ftrim();                 
  drone.config('general:navdata_demo', 'TRUE');
});

//Drone 1 takes off and 4 secs later Drone 2 take off
	console.log('drone1 Takeoff!');
    drone1.takeoff();
    drone1.stop();
    drone1.after(4000, function()
	    {
	     //drone1 is in air
	     onAir1 = true;
	     console.log("Drone 1 is in air");
	     console.log('drone2 Takeoff!');
	     drone2.takeoff();
	     drone2.stop();
	    });
    drone2.after(1000,function()
    	{
    		//drone2 is in air
    		onAir2 = true;
	     console.log("Drone 1 is in air");
    	});

//Now the GPIO takes over the control by watch() function
//Sychronized function so paralle 

button1.watch(function(err, value){
// Drone 1 up function
	if (value === 0) {
	console.log("Drone 1 goes up!");
	//Drone go up in 80% speed for .3 sec
	drone1.up(0.8);  
    setTimeout(function(){ 
                          drone1.stop();
                          console.log("Stop: 1");
                         }, 300);   
	}
	//If D1 is in air and no command hold position
	else if (onAir1 == true){
		console.log("No command for drone1 so hover.");
		drone1.stop();
	}

});

button2.watch(function(err, value){
// Drone 2 up function
	if (value === 0) {
	console.log("Drone 2 goes up!");
	//Drone go up in 80% speed for .3 sec
	drone2.up(0.8);  
    setTimeout(function(){ 
                          drone2.stop();
                          console.log("Stop: 2");
                         }, 300);   
	}
	//If D2 is in air and no command hold position
	else if (onAir2 == true){
		console.log("No command for drone2 so hover.");
		drone2.stop();
	}
	
});

button3.watch(function(err, value){
// Fleet land function
	if (value === 0) {
	console.log("Fleet landing!");
	//The whole fleet will land after button3 is pressed
	fleet.forEach(function(drone){
      drone.stop();
      drone.land();
    	});
	}
});