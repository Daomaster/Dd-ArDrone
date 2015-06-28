var arDrone = require('ar-drone');    
var drone = arDrone.createClient({ip: '192.168.1.204'});

console.log('Take off');
drone.takeoff();
