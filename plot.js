var Plotly = require('plotly')('Daomaster','1i7911aysc');
var Signal = require('random-signal');
//Each trace needs one token in order to stream 
var tokens = ["8ndzhzyhoy","no19cl7wb8"];
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

var layout = {
    filename: "stream-multiple-traces",
    fileopt: "overwrite",
  layout: {
    title: "streaming mock sensor data",
    showlegend: true
  },
  world_readable: true
};

//Starting plot
Plotly.plot(data, layout, function (err, resp) {
    if (err) return console.log("ERROR", err, data);
    console.log(resp);

    [0, 1].forEach(function(i) {
        var plotlystream = Plotly.stream(tokens[i], function() {}),
            signalstream = Signal({tdelta: 100});
        //When exit the program it stop writing to the plot    
        plotlystream.on("error", function (err) { signalstream.destroy(); });

        signalstream.pipe(plotlystream);
    });

});