var keypress = require('keypress');   //Library that reads input
var arDrone = require('ar-drone');    //Drone library called "Node drone"

var drone = arDrone.createClient({ip: '192.168.1.200'}); //Drone  and ip addresses

var altitude;
var a = 100;
var b = 120;	//Altitude variable for climb 100cm. Find and figure out how to get it to 100cm with a 100 tst alt
var c = 140;

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

 'a': function(){               
	
    	console.log("Testing climb function 100");
  		climb(drone,a);
  		drone.stop();
    },
 'b': function(){               
	
    	console.log("Testing climb function 120");
  		climb(drone,b);
  		drone.stop();
    },
 'c': function(){               
	
    	console.log("Testing climb function 140");
  		climb(drone,c);
  		drone.stop();
    }

  	
  }

	
  

var quit = function(){
  console.log('Quitting');
  process.stdin.pause();
   drone.stop();
   console.log('Landing');
   drone.land();
   drone._udpControl.close();

}

var climb = function(drone,target)
  {

   var n= getaltitude(drone);
   console.log(n + "cm");

   if(n === target)
   {
    //n === testalt : The drone has reached the desired altitude
    
      drone.stop();

    console.log("Reached altitude of 100cm"); 
   }
   else if (n > target)
   {
     drone.down(.5);     //lowers altitude:20% speed (Because of gravity)
    //  drone.stop();   //Commented out to see if this affects anything.
    setTimeout(function(){ 
                          console.log("Higher than "+target+"cm...lowering")
                          console.log("After: "+ n);
                          drone.stop();
                          climb(drone,target);  
                         }, 200); 

   }
   else     //n < altitude
   {
     drone.up(.5);       //raises altitude with 40% speed
    //  drone.stop();     //Commented out to see if this affects anything.
     setTimeout(function(){ 
                          console.log("Lower than "+target+"cm...uping")
                          console.log("After: "+ n);
                          drone.stop();
                          climb(drone,target);  
                         }, 200); //100 or 200 maybe, will need to test to figure out
    

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
      setTimeout(function(){ 
                          console.log(altitude); 
                         }, 200);
      
    		}
		}
	});

  };


   
 
process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name])                           //Finds the matching keyname and executes the function, inside the key.name array
    { keys[key.name](); }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
  print_altitude(drone);
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues