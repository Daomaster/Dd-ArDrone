var keypress = require('keypress');   //Library that reads input
var arDrone = require('ar-drone');    //Drone library called "Node drone"

var drone1 = arDrone.createClient({ip: '192.168.1.200'}); //Drone 1 and ip addresses
var drone2 = arDrone.createClient({ip: '192.168.1.202'}); //Drone 2 and ip addresses

var fleet = [drone1,drone2];    //Array of the two drones
//var altitude = 0;
// write function get altitude

fleet.forEach(function(drone)
{
	drone.ftrim();                 //Flat trim. Calibrates to the ground level
});

keypress(process.stdin);        //reads in a key press

var keys = {
  'space': function(){

    console.log('drone1 Takeoff!');
    drone1.takeoff();
    drone1.stop();
    drone1.on('navdata.demo.altitudeMeters', console.log);
    drone1.after(3000, function()
    {
     console.log('drone2 Takeoff!');
     drone2.takeoff();
     drone2.stop();
    });
    //Need to work on getting them stable and not interfere with eachother's space
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

    
  },

  'w': function(){
    console.log('drone1 up!');

    drone1.up(0.8);
      
    drone1.after(500, function(){

    	this.stop();
    });
    
  },

 'k': function(){
    console.log('drone2 takeoff!');

    drone2.takeoff();
    drone2.stop();                //Stop to hover, after every command
    
  },

  'i': function(){
    console.log('drone2 up!');

	drone2.up(0.8);              //Speed 80%
      
    drone2.after(500, function()      //500 miliseconds
    {

    	this.stop();
    });
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

var climb = function(drone, altitude)
  {
  console.log('Takeoff!');
  drone.takeoff();
  drone.stop();
   drone.on('navdata.demo.altitudeMeters', console.log);    //gets the altitude data

   var n = altitudeMeters.toFixed(1);           //set precision to integer value

   if(n == altitude)
   {  console.log('Reached altitude of 200'); }
   else if (n > altitude)
   {
     drone.down(.2);     //lowers altitude with 20% speed (To take into consideration of gravity)
    drone.stop();
    climb();
   }
   else     //n < altitude
   {
    drone.up(.4);       //raises altitude with 40% speed
    drone.stop();
    climb();
   }
  };

process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name])                           //Finds the matching keyname and executes the function, inside the key.name array
    { keys[key.name](); }
  if(key && key.ctrl && key.name == 'c') { quit(); }  //If key.name === 'c' use the quit function
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues


