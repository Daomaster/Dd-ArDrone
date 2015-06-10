var keypress = require('keypress');  

var stop = false;
var print = 'a';

keypress(process.stdin);  

var keys = {


  'a': function(){
    console.log('Interupt');
    stop = true;
    print = 'a';
    stop = false;
    test();
  },

  'b': function(){
    console.log('Interupt');
    stop = true;
    print = 'b';
    stop = false;
    test();
  }
}

var test = function (){
	if (stop === true) 
		{
			return "Intterupt!";
		}
	else
		{

			for (i = 0; i <= 100; i++) {
		    console.log(print);
			}
		}
}

process.stdin.on('keypress', function (ch, key) {
  if(key && keys[key.name])                           //Finds the matching keyname and executes the function, inside the key.name array
    { keys[key.name](); }
});

process.stdin.setRawMode(true);     //Refresh and keep true.
process.stdin.resume();             //Continues



