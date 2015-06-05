var keypress = require('keypress');   //Library that reads input
var arDrone = require('ar-drone');    //Drone library called "Node drone"

var drone1 = arDrone.createClient({ip: '192.168.1.200'}); //Drone 1 and ip addresses
var drone2 = arDrone.createClient({ip: '192.168.1.202'}); //Drone 2 and ip addresses

var altitude = 0; //Initial for the global altitude
var testalt = 100;	//Altitude variable for climb 100cm

var fleet = [drone1,drone2];    //Array of the two drones



fleet.forEach(function(drone)
{
	drone.ftrim();                 //Flat trim. Calibrates to the ground level
  drone.config('general:navdata_demo', 'TRUE');
});

keypress(process.stdin);        //reads in a key press

var keys = {
  'space': function(){

    console.log('drone1 Takeoff!');
    drone1.takeoff();
    drone1.stop();
    setTimeout(function(){ 
                          console.log("drone2 Takeoff");
                          drone2.takeoff();
                          drone2.stop();
                         }, 3000);   
  },

  'l': function(){
    console.log('Land!');

    fleet.forEach(function(drone){
      drone.stop();
      drone.land();
    });
  },

  's': function(){
    console.log('drone1 takeoff!');

    drone1.takeoff();
    drone1.stop();

    getaltitude(drone1);

  },

  'w': function(){
    console.log('drone1 up!');

    drone1.up(1);
    setTimeout(function(){ 
                          drone1.stop();
                          console.log("Stop: 1");
                         }, 300);   
  },

 't': function(){               //The button to test the climb function
	console.log("Takeoff!");
	drone1.takeoff();

	drone1.stop();
	drone1.after(3000, function()      //2 seconds
    {
    	
    	console.log("Testing climb function");
  		climb(this);
    });

  	
  },

 'k': function(){
    console.log('drone2 takeoff!');
    //drone2.config('general:navdata_demo', 'FALSE');
    drone2.takeoff();
    drone2.stop();                //Stop to hover, after every command

    getaltitude(drone2);
    
  },

  'i': function(){
  console.log('drone2 up!');
	drone2.up(1);              //Speed 80%   
    setTimeout(function(){ 
                          drone2.stop();
                          console.log("Stop: 2");
                         }, 300);   
	}
}

var quit = function(){
  console.log('Quitting');
  process.stdin.pause();

  fleet.forEach(function(drone){
      drone.stop();
      console.log('Landing');
      drone.land();
      drone._udpControl.close();
    });
}

var climb = function(drone)
  {

   var n= getaltitude(drone);
   console.log(n + "cm");

   if(n === testalt)
   {
    //n === testalt : The drone has reached the desired altitude
    
      drone.stop();

    console.log("Reached altitude of 100cm"); 
   }
   else if (n > testalt)
   {
     drone.down(.1);     //lowers altitude:20% speed (Because of gravity)
    //  drone.stop();   //Commented out to see if this affects anything.
    setTimeout(function(){ 
                          console.log("Higher than 100cm...lowering")
                          console.log("After: "+ n);
                          drone.stop();
                          climb(drone);  
                         }, 100); 

   }
   else     //n < altitude
   {
     drone.up(.4);       //raises altitude with 40% speed
    //  drone.stop();     //Commented out to see if this affects anything.
     setTimeout(function(){ 
                          console.log("Lower than 100cm...Rising")
                          console.log("After: "+ n);
                          drone.stop();
                          climb(drone);  
                         }, 100); 

   }
  }

 
 var getaltitude = function(drone)
  {

   drone.on('navdata', function(d) {
  	if (d.demo) {
    if (d.demo.altitude) {
      altitude = d.demo.altitude;
      altitude = altitude * 100;
      altitude = Math.round(altitude);
      //console.log("ALTITUDE " + altitude + " cm");
    		}
		}
	});
   return altitude;
  };
   
 
process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name])                           //Finds the matching keyname and executes the function, inside the key.name array
    { keys[key.name](); }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
  //Make the drone hover every 2 seconds when no command.
  
  fleet.forEach(function(drone){
      drone.after(2000,function(){
        console.log("After command!")
        drone.stop();
      });
  });
  
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues
