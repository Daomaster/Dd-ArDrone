// Libary set-up
var keypress = require('keypress');   
var arDrone = require('ar-drone');    

// Drone initialization
var drone = arDrone.createClient({ip: '192.168.1.200'}); //Drone  and ip addresses

// Global varibles
var altitude;
var a = 100;
var b = 120;	//Altitude variable for climb 100cm. Find and figure out how to get it to 100cm with a 100 tst alt
var c = 140;
var speed = .6;		//Speed variable
var stop = false;

// Read in the keys
keypress(process.stdin);        

// Declare key modules
var keys = {

  // l for land
  'l': function(){
    console.log('Land!');
    drone.stop();
    drone.land();
  },

  // s for drone1 take off
  's': function(){
    console.log('drone1 takeoff!');
    drone.takeoff();
    drone.stop();

  },

  // w for drone1 go up
  'w': function(){
    console.log('drone up!');
    drone.up(1);
    setTimeout(function(){ 
                          drone.stop();
                          console.log("Stop: 1");
                         }, 300);  
  	
  },

  // q for stop the drone
  'q': function(){
	console.log("drone stop!");
  	drone.stop();
  },

  // o for line 1
  'o': function(){               
	
    	console.log("Testing climb function 100");
  		stop = true;
  		climb(drone,a,speed);
  		drone.stop();
    },
  
  // k for line 2  
  'k': function(){               
	
    	console.log("Testing climb function 120");
  		stop = true;
  		climb(drone,b,speed);
  		drone.stop();
    },
  
  // m for line 3
  'm': function(){               
	
    	console.log("Testing climb function 140");
  		stop = true;
  		climb(drone,c,speed);
  		drone.stop();
    }

  	
  }

  // when exit the program 
var quit = function(){
  console.log('Quitting');
  process.stdin.pause();
   drone.stop();
   console.log('Landing');
   drone.land();
   drone._udpControl.close();

}

// reach to the target altitude	
var climb = function(drone,target,speed)
  {
   stop = false;
   var current=getaltitude(drone);
   console.log(current + "cm");
   
 while(!stop){
   
   if(current === target)
   {    
    drone.stop();
    console.log("Reached altitude of " + target); 
    stop = true;
   }
   else if (current > target)
   {
     drone.down(speed);     //lowers altitude:20% speed (Because of gravity)
    setTimeout(function(){ 
      console.log("Higher than "+target+"cm...lowering")
      console.log("After: "+ current);
      drone.stop();
      if(Math.abs(target-current)>=15 && Math.abs(target-current)<=20)
      {
      	speed=.4;
      }
      else if(Math.abs(target-current)>=10 && Math.abs(target-current)<15)
      {
      	speed =.3;
      }
      else if(Math.abs(target-current)<10)
      {
      	speed=.2;
      }
      climb(drone,target,speed);  
     }, 100); 

   }
   else     //n < altitude
   {
     drone.up(speed);       //raises altitude with 40% speed
	  setTimeout(function(){ 
		  console.log("Lower than "+target+"cm...uping")
		  console.log("After: "+ current);
		  drone.stop();
		  if(Math.abs(target-current)>=15 && Math.abs(target-current)<=20)
		  {
		  	speed=.4;
		  }
		  else if(Math.abs(target-current)>=10 && Math.abs(target-current)<15)
		  {
		  	speed =.3;
		  }
		  else if(Math.abs(target-current)<10)
		  {
		  	speed=.2;
		  }
		  console.log("Speed :"+ speed);
		  climb(drone,target, speed);  
	 }, 100); //100 or 200 maybe, will need to test to figure out
   }
 }
 	stop = false;
}

 var newSpeed = function(target,current)
 {
	if(Math.abs(target-current)>=15 && Math.abs(target-current)<=20)
      {
      	speed=.4;
      	return speed;
      }
      else if(Math.abs(target-current)>=10 && Math.abs(target-current)<15)
      {
      	speed =.3;
      	return speed;
      }
      else if(Math.abs(target-current)<10)
      {
      	speed=.2;
      	return speed;
      }
                      };

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