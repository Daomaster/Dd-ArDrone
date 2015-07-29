var ardrone = require('ar-drone');

function drone(address,id){
	this.address = '192.168.1.'+ address;
	this.id = id;
	this.isAir = false;
	this.isTarget = false;
	this.controller = ardrone.createClient({ip: this.address});
	var getaltitude = function(this.controller){
		controller.on('navdata', function(d) {
  		if (d.demo) {
    	if (d.demo.altitude) {
      	var altitude = d.demo.altitude;
      	altitude = altitude * 100;
      	altitude = Math.round(altitude);
        return altitude;
    			}	
			}
		}
	};
}

module.exports = drone;