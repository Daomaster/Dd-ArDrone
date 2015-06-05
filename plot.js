'use strict';

var plotly = require('plotly')('Daomaster','1i7911aysc');

var initdata = [{x:[], y:[], stream:{token:'i88xvruc4t', maxpoints:200}}];
var initlayout = {fileopt : 'overwrite', filename : 'nodenodenode'};

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);

    var stream1 = plotly.stream('i88xvruc4t', function (err, res) {
        if (err) return console.log(err);
        console.log(res);
        clearInterval(loop); // once stream is closed, stop writing
    });

    var i = 0;
    var loop = setInterval(function () {
        var data = { x : i , y : i * (Math.random() * 10) };
        var streamObject = JSON.stringify(data);
        stream1.write(streamObject+'\n');
        i++;
    }, 100);
});