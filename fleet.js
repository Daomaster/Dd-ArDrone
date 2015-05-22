var keypress = require('keypress');   //Library that reads input
var arDrone = require('ar-drone');    //Drone library called "Node drone"

var drone1 = arDrone.createClient({ip: '192.168.1.200'}); //Drone 1 and ip addresses
var drone2 = arDrone.createClient({ip: '192.168.1.202'}); //Drone 2 and ip addresses

var fixaltitude = 0; //Initial for the global altitude
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
    drone1.after(5000, function()
    {
     console.log('drone2 Takeoff!');
     drone2.takeoff();
     drone2.stop();
     //May still need to alter things here to allow for stability
     //in the individual drone's take off and hover state.
    });
   
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

    drone1.up(0.8);
      
    drone1.after(500, function(){
    	this.stop();
    });
    
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

	drone2.up(0.8);              //Speed 80%
      
    drone2.after(500, function()      //500 miliseconds
    {

    	this.stop();
    });
  },
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

   var n=0;
   n= getaltitude(drone);
   console.log(n + "cm");

   if(n === testalt)
   {
    //n === testalt : The drone has reached the desired altitude
    
      drone.stop();

    console.log("Reached altitude of 100cm"); 
   }
   else if (n > testalt)
   {
     drone.down(.4);     //lowers altitude:20% speed (Because of gravity)
    //  drone.stop();   //Commented out to see if this affects anything.
    drone.after(10, function()      //500 msec/.5 sec
    {
       console.log("Higher than 100cm...Lowering")
       console.log("n: "+ n);
       climb(drone);
    });

   }
   else     //n < altitude
   {
     drone.up(.6);       //raises altitude with 40% speed
    //  drone.stop();     //Commented out to see if this affects anything.
     drone.after(10, function()      //500 msec/.5 sec
    {
       console.log("Lower than 100cm...Rising")
       console.log("n: "+ n);  
       climb(drone);
    });

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
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues
