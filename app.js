'use strict';

// Libary set-up
var keypress = require('keypress');   
var arDrone = require('ar-drone'); 

// Server set-up
var app = require('express');
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


// Drone initialization
var drone = arDrone.createClient();

// GPIO initialization
var GPIO = require('onoff').Gpio,
    button1 = new GPIO(2, 'in', 'both'),
    button2 = new GPIO(3, 'in', 'both'),
    button3 = new GPIO(4, 'in', 'both'),
    led1 = new GPIO(17,'out'),
    led2 = new GPIO(27,'out'),
    led3 = new GPIO(22,'out'),
    b_takeoff = new Gpio(14, 'in', 'both'),
    b_land = new Gpio(15, 'in', 'both'),
    iv;

// Global varibles
var altitude;
var target = 75;
var a = 100;
var b = 120;
var c = 140;
var stop = false;
var userNum = 1;


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
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
   var getLed = function(target)
   {
    switch(target){
      case a:
      return led1;
      break;

      case b:
      return led2;
      break;

      case c:
      return led3;
      break;
    }
   }; 

   var getColor = function(target)
   {
    switch(target){
      case a:
      return 'green';
      break;

      case b:
      return 'yellow';
      break;

      case c:
      return 'red';
      break;
    }
   }; 


   var ledOff = function()
   {
     led1.writeSync(0);
     led2.writeSync(0);
     led3.writeSync(0);
   }

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
   
   if(current === target || (current > target-2 && current < target+2))
   {    
    drone.stop();
    console.log("Reached altitude of " + target); 
    getLed(target).writeSync(1);
    io.emit('check',getColor(target));
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
};

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
  }); //may need to put return altitude here between the right brackets
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

  // Blink function
  var blink = function(time){
    //blink every 200ms
    iv = setInterval(function () {
    led1.writeSync(led1.readSync() ^ 1); // 1 = on, 0 = off :) 
    led2.writeSync(led1.readSync() ^ 1); 
    led3.writeSync(led1.readSync() ^ 1); 
    }, 200);

    setTimeout(function () {
    clearInterval(iv); // Stop blinking 
    ledOff();
     }, time);
  }



///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//Program Start

//Make sure all the LED are off
ledOff();

//Flat trim
drone.ftrim();

//Websocket is on listening if any client connected
io.on("connection",function (socket) {

//Debug Message
console.log(userNum + " Clients Connected!");
userNum++;

socket.on('disconnect',function(){
console.log("Client disconnect!")
userNum--;
});

// Read in the keys
keypress(process.stdin);  


//GPIO Pin 2
button1.watch(function(err, value){
//100cm (98~102)
  if (value === 0) {
  ledOff();
  console.log("100cm !");
  climb(drone,a);
  } 
});


//GPIO Pin 3
button2.watch(function(err, value){
//  120cm (118~122)
  if (value === 0) {
  ledOff();
  console.log("120cm !");
  climb(drone,b);
  } 
});


//GPIO Pin 4
button3.watch(function(err, value){
// 140cm (138~142)
  
  if (value === 0) {
  ledOff();
  console.log("140cm !");
  climb(drone,c);
  }
});

b_takeoff.watch(function(err, value){
    if (value === 0)
    {drone.takeoff();}
});

b_land.watch(function(err, value){
    if (value === 0)
    {drone.land();}
});

// Exit the program 
var quit = function(){
  console.log('Quitting');
  process.stdin.pause();
   drone.stop();
   ledOff();
   console.log('Landing');
   drone.land();
   drone._udpControl.close();

};

process.stdin.on('keypress', function (ch, key) {
  // If key.name === 'c' use the quit function
  if(key && key.name == 'l') {
   drone.stop();
   ledOff();
   drone.land();
 }
 if(key && key.name == 's') {
   drone.takeoff();
   drone.stop();
 }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues

});

server.listen(8080);
console.log("Server is listening to port: 8080 .........")
