'use strict';

// Libary set-up
var plotly = require('plotly')('Daomaster','1i7911aysc');
var keypress = require('keypress');   
var arDrone = require('ar-drone');    

// Drone initialization
var drone = arDrone.createClient(); 

// Stream initialization
var data = [];
var layout;
var tokens = ["8ndzhzyhoy","no19cl7wb8"];
// Global varibles
var altitude;
var target = 75;
var a = 100;
var b = 120;  
var c = 140;
var stop = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function set-up
var stream = function(drone, plotly)
{
//Set up empty array of data to set the two traces
//First one is for the current altitude
var first = {
    x: [],
    y: [],
    name: "Current",  
    stream:{token:tokens[0], maxpoints:200}
};
//Second is for the target altitude
var second = {
    x: [],
    y: [],
    name: "Target",  
    stream:{token:tokens[1], maxpoints:200}
};
//Put the data into the data array
var data = [first,second];
//Layout for the stream
var layout = {
    filename: "AR Drone",
    fileopt: "overwrite",
    layout: {
    title: "AR Drone altitude sensor",
      yaxis: {
      title:"Altitude (cm)",
      range: [0,160],
      ticks: "outside",
      tick0: 0,
      dtick: 20,
      tickcolor: "#000"
    },
    showlegend: true
  },
  world_readable: true
}

plotly.plot(data, layout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);

    var stream1 = plotly.stream(tokens[0], function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });

    var stream2 = plotly.stream(tokens[1], function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });
    var streamObject = [];
    var i = 0;
    var loop = setInterval(function () {
        data[0] = { x : i , y : getaltitude(drone) };
        data[1] = { x : i , y : target };
        streamObject[0] = JSON.stringify(data[0]);
        streamObject[1] = JSON.stringify(data[1]);
        stream1.write(streamObject[0]+'\n');
        stream2.write(streamObject[1]+'\n');
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
   
   if(current === target || (current > target-3 && current < target+3))
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
   
   else if (current < target)    
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
  'o': function(){  //             
  
      console.log("Testing climb function 100");
      stop = true;
      setTimeout(function(){
      stop=false;
      target = a;
      console.log("Target is "+target);
      climb(drone,target);
      drone.stop();
      },100);



    },
  
  // k for line 2  
  'k': function(){  //2nd line             
  
      console.log("Testing climb function 120");
      stop = true;
      setTimeout(function(){
      stop=false;
      target = b;
      console.log("Target is "+target);
      climb(drone,target);
      drone.stop();
      },100);
      
    },
  
  // m for line 3
  'm': function(){               
  
      console.log("Testing climb function 140");
      stop = true;
      setTimeout(function(){
      stop=false;
      target = c;
      console.log("Target is "+target);
      climb(drone,target);
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