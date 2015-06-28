'use strict';

// Libary set-up
var plotly = require('plotly')('Daomaster','1i7911aysc');
var keypress = require('keypress');   
var arDrone = require('ar-drone');    

// Drone initialization
var drone1 = arDrone.createClient({ip: '192.168.1.200'});
var drone2 = arDrone.createClient({ip: '192.168.1.202'});
var drone3 = arDrone.createClient({ip: '192.168.1.203'});
var fleet = [drone1,drone2,drone3];
drone.disableEmergency(); 

// Stream initialization
var data = [];
var layout;
var tokens = ["8ndzhzyhoy","no19cl7wb8"];

// GPIO initialization
var GPIO = require('onoff').Gpio,
    button1 = new GPIO(2, 'in', 'both'),
    button2 = new GPIO(3, 'in', 'both'),
    button3 = new GPIO(4, 'in', 'both'),
    button4 = new GPIO(17, 'in', 'both'),
    button5 = new GPIO(27, 'in', 'both'),
    button6 = new GPIO(22, 'in', 'both'),
    button7 = new GPIO(11, 'in', 'both'),
    button8 = new GPIO(8, 'in', 'both'),
    button9 = new GPIO(7, 'in', 'both'),
    led1 = new GPIO(14,'out'),
    led2 = new GPIO(15,'out'),
    led3 = new GPIO(18,'out'),
    led4 = new GPIO(23,'out'),
    led5 = new GPIO(24,'out'),
    led6 = new GPIO(10,'out'),
    led7 = new GPIO(16,'out'),
    led8 = new GPIO(20,'out'),
    led9 = new GPIO(21,'out'),
    iv;

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
   var getLed = function(target)
   {
    switch(target){
      case a:
      return led3;
      break;

      case b:
      return led1;
      break;

      case c:
      return led2;
      break;


    }
   }; 

   var ledOff = function()
   {
     led1.writeSync(0);
     led2.writeSync(0);
     led3.writeSync(0);
     led4.writeSync(0);
     led5.writeSync(0);
     led6.writeSync(0);
     led7.writeSync(0);
     led8.writeSync(0);
     led9.writeSync(0);
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

  // Blink function
  var blink = function(time){
    //blink every 200ms
    iv = setInterval(function () {
    led1.writeSync(led1.readSync() ^ 1); // 1 = on, 0 = off :) 
    led2.writeSync(led2.readSync() ^ 1); 
    led3.writeSync(led3.readSync() ^ 1);
    led4.writeSync(led4.readSync() ^ 1);
    led5.writeSync(led5.readSync() ^ 1);
    led6.writeSync(led6.readSync() ^ 1);
    led7.writeSync(led7.readSync() ^ 1);
    led8.writeSync(led8.readSync() ^ 1);
    led9.writeSync(led9.readSync() ^ 1);
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

//Start stream listener
stream(drone,plotly);

// Read in the keys
keypress(process.stdin);  

// Blink the LED
blink(2000);

//Drone take off when program starts
  console.log('drone Takeoff!');
    drone.takeoff();
    drone.stop();

//Now the GPIO takes over the control by watch() function
//Sychronized function so paralle 

button1.watch(function(err, value){

  if (value === 0) {
  ledOff();
  console.log("100cm !");
  climb(drone1,a);
  drone.stop();  
  } 
});

button2.watch(function(err, value){

  if (value === 0) {
  ledOff();
  console.log("120cm !");
  climb(drone1,b);
  drone.stop();  
  } 
});


button3.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("140cm !");
  climb(drone1,c);
  drone.stop();  
  }
});

button4.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("100cm !");
  //CHANGE
  climb(drone2,a);
  drone.stop();  
  }
});

button5.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("120cm !");
  climb(drone2,b);
  drone.stop();  
  }
});

button6.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("140cm !");
  climb(drone2,c);
  drone.stop();  
  }
});

button7.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("100cm !");
  climb(drone3,a);
  drone.stop();  
  }
});

button8.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("120cm !");
  climb(drone3,b);
  drone.stop();  
  }
});

button9.watch(function(err, value){
  
  if (value === 0) {
  ledOff();
  console.log("140cm !");
  climb(drone3,c);
  drone.stop();  
  }
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
   blink(2000);
   drone.stop();
 }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues
