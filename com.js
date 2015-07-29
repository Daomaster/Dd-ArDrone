var arDrone = require('ar-drone');    
var drone = arDrone.createClient();


console.log('Take off');
drone.takeoff();
drone.after(function(){
drone.land();
}, 1000);
