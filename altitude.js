'use strict';

// Libary set-up
var plotly = require('plotly')('Daomaster','1i7911aysc');
var keypress = require('keypress');   
var arDrone = require('ar-drone');    

// Drone initialization
var drone = arDrone.createClient({ip: '192.168.1.200'}); 

// Stream initialization
var initdata;
var initlayout;

// Global varibles
var altitude;
var a = 100;
var b = 120;  
var c = 140;
var stop = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function set-up
var stream = function(drone, plotly)
{

var initdata = [{x:[], y:[], stream:{token:'i88xvruc4t', maxpoints:1000}}];
var initlayout = {fileopt : 'overwrite', filename : 'altitude_stream'};

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);

    var stream1 = plotly.stream('i88xvruc4t', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });

    var i = 0;
    var loop = setInterval(function () {
        var data = { x : i , y : getaltitude(drone)};
        var streamObject = JSON.stringify(data);
        stream1.write(streamObject+'\n');
        i++;
    }, 200);
    });
}

// Using shift to determine the timeout value
 var newTimeout = function(shift)
 {
   switch(shift){
    case 1:
    return 100;
    break;

    case 2:
    return 80;
    break;

    case 3:
    return 60;
    break;

    case 4:
    return 40;
    break;
   }
                      };

 // Using shift to determine the speed value
 var newSpeed = function(shift)
 {
   switch(shift){
    case 1:
    return 0.8;
    break;

    case 2:
    return 0.6;
    break;

    case 3:
    return 0.4;
    break;

    case 4:
    return 0.2;
    break;
   }
                      };

  // Pre-determine the shift with target and current
  var getshift = function(target,current)
 {
  if(Math.abs(target-current)>=15 && Math.abs(target-current)<=20)
      {
        return 2;
      }
      else if(Math.abs(target-current)>=10 && Math.abs(target-current)<15)
      {
        return 3;
      }
      else if(Math.abs(target-current)<10)
      {
        return 4;
      }
      else
      {
        return 1;
      }
                      };

// Reach to the target altitude 
var climb = function(drone,target)
  {
   var current=getaltitude(drone);

   // Determine the shift
   var shift = getshift(target,current);

   // Debug
   console.log("Shift: "+shift);
   console.log("Speed: "+newSpeed(shift));
   console.log("Timeout: "+newTimeout(shift));
   console.log("Target: "+target+" cm");   
   console.log("Current: "+current+" cm");
   
 if(stop === false){
   
   if(current === target)
   {    
    drone.stop();
    console.log("Reached altitude of " + target); 
    return;
   }
   
   else if (current > target)
   {
     // Speed and timeout is determined by the shift
     drone.down(newSpeed(shift));     
    setTimeout(function(){ 
      console.log("Higher than "+target+"cm...lowering")
      console.log("After: "+ current);
      drone.stop();
      climb(drone,target);  
     }, newTimeout(shift)); 

   }
   
   else     
   {
      // Speed and timeout is determined by the shift
     drone.up(newSpeed(shift));       
    setTimeout(function(){ 
      console.log("Lower than "+target+"cm...uping")
      console.log("After: "+ current);
      drone.stop();
      climb(drone,target);  
   }, newTimeout(shift)); 
   }
 }
else{
  return;
}
}

 // Return the altitude from the Navdata 
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

 // Constantly print out the current altitude
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Program Start

//Flat trim
drone.ftrim();

//Start stream listener
stream(drone,plotly);

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
      setTimeout(function(){
      stop=false;
      climb(drone,a);
      drone.stop();
      },100);
    },
  
  // k for line 2  
  'k': function(){               
  
      console.log("Testing climb function 120");
      stop = true;
      setTimeout(function(){
        stop=false;
          climb(drone,b);
        drone.stop();
      },100);
      
    },
  
  // m for line 3
  'm': function(){               
  
      console.log("Testing climb function 140");
      stop = true;
      setTimeout(function(){
        stop=false;
        climb(drone,c);
        drone.stop();
      },100);
    }

  }

// Exit the program 
var quit = function(){
  console.log('Quitting');
  process.stdin.pause();
   drone.stop();
   console.log('Landing');
   drone.land();
   drone._udpControl.close();

}

process.stdin.on('keypress', function (ch, key) {
  // Finds the matching keyname and executes the function, inside the key.name array
  if(key && keys[key.name])                           
    { keys[key.name](); }
  
  // If key.name === 'c' use the quit function
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
  
  // Print out the altitude for debug reason
  //print_altitude(drone);

});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues