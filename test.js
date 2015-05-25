var autonomy = require('ardrone-autonomy');
var mission1  = autonomy.createMission({ip: '192.168.1.200'});

mission1.takeoff()
       .zero()       // Sets the current state as the reference
       .altitude(1)  // Climb to altitude = 1 meter
       .hover(1000)  // Hover in place for 1 second
       .land();

mission1.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("Mission success!");
        process.exit(0);
    }
});