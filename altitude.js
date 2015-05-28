var keypress = require('keypress');   //Library that reads input
var arDrone = require('ar-drone');    //Drone library called "Node drone"

var drone = arDrone.createClient({ip: '192.168.1.202'}); //Drone  and ip addresses

var altitude;
var testalt = 100;	//Altitude variable for climb 100cm

keypress(process.stdin);        //reads in a key press

var keys = {

  'l': function(){
    console.log('Land!');
    drone.stop();
    drone.land();
  },

  's': function(){
    console.log('drone1 takeoff!');
    drone.takeoff();
    drone.stop();

  },

  'w': function(){
    console.log('drone up!');
    drone.up(1);
    setTimeout(function(){ 
                          drone.stop();
                          console.log("Stop: 1");
                         }, 300);  
  	
  },

  'q': function(){
	console.log("drone stop!");
  	drone.stop();
  },

 't': function(){               //The button to test the climb function
	console.log("Takeoff!");
	drone.takeoff();

	drone.stop();
	drone.after(3000, function()      //3 seconds
    {
    	
    	console.log("Testing climb function");
  		climb(this);
    });

  	
  },

	}
  

var quit = function(){
  console.log('Quitting');
  process.stdin.pause();
   drone.stop();
   console.log('Landing');
   drone.land();
   drone._udpControl.close();

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
    		}
		}
	});
   return altitude;
  };

var print_altitude = function(drone)
  {

   drone.on('navdata', function(d) {
  	if (d.demo) {
    if (d.demo.altitude) {
      altitude = d.demo.altitude;
      altitude = altitude * 100;
      altitude = Math.round(altitude);
      console.log(altitude);
    		}
		}
	});

  };


   
 
process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name])                           //Finds the matching keyname and executes the function, inside the key.name array
    { keys[key.name](); }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
  else{
  	console.log("After command!");
  }
  
        console.log("After command 1!");
        //console.log(getaltitude(drone));
        //drone.stop();
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues