var username = 'wirtanen'
  , apikey ='sgwbn2rvvv'               // , is like "" in english language. (Repeat)
  , tokens = [['w71lgs17ne', 'xjifgw7zw2'],['geaz6xy5hf','pu65keoqe4']]
  , hex = [["#00CCFF", "#FF0066"], ["#009900","#660066"]]
  , fname = ["Sensor1", "Sensor2"]
  , Plotly = require('plotly')(username, apikey)
  , Signal = require('random-signal')

var stream = function(hex, fname,tokens)
{
//Set up empty array of data to set the two traces
//First one is for the current altitude
var first = {
    x: [],
    y: [],
    name: "Current", 
    line:
    {color: hex[0]},
    stream:{token:tokens[0], maxpoints:200}
};
//Second is for the target altitude
var second = {
    x: [],
    y: [],
    name: "Target",
    line:
    {color: hex[1]}, 
    stream:{token:tokens[1], maxpoints:200}
};
//Put the data into the data array
var data = [first,second];
//Layout for the stream
var layout = {
    filename: fname,
    fileopt: "overwrite",
    layout: {
    title: "Multi Trace Test",
      yaxis: {
      title:"Y",
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

Plotly.plot(data, layout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);

    var stream1 = Plotly.stream(tokens[0], function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });

    var stream2 = Plotly.stream(tokens[1], function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });
    var streamObject = [];
    var i = 0;
    var loop = setInterval(function () {
        data[0] = { x : i , y : Math.floor(Math.random()* 100) };
        data[1] = { x : i, y : Math.floor(Math.random()*100) };
        streamObject[0] = JSON.stringify(data[0]);
        streamObject[1] = JSON.stringify(data[1]);
        stream1.write(streamObject[0]+'\n');
        stream2.write(streamObject[1]+'\n');
        i++;
    }, 200);
});

}

stream(hex[0],fname[0], tokens[0]);
stream(hex[1],fname[1], tokens[1]);
