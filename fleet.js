var keypress = require('keypress');
var arDrone = require('ar-drone');

var drone1 = arDrone.createClient({ip: '192.168.1.200'});
var drone2 = arDrone.createClient({ip: '192.168.1.202'});

var fleet = [drone1,drone2];

fleet.forEach(function(drone){
	drone.ftrim();
});

keypress(process.stdin);

var keys = {
  'space': function(){
    console.log('Takeoff!');
    fleet.forEach(function(drone){
      drone.takeoff();
      drone.stop();
    })
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
    drone2.stop();
    
  },

  'i': function(){
    console.log('drone2 up!');

	drone2.up(0.8);
      
    drone2.after(500, function(){

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

process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name]){ keys[key.name](); }
  if(key && key.ctrl && key.name == 'c') { quit(); }
});

process.stdin.setRawMode(true);
process.stdin.resume();


