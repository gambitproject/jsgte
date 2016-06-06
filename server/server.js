var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }))
var spawn = require('child_process').spawn;
var http = require('http').Server(app);
app.set('port',(process.env.PORT||3000));
app.use(express.static('../html/'));
app.set('layout');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
var gameIndex = 0;
http.listen (app.get('port'),function(){
  console.log("listening to port number "+app.get('port'));
  console.log("tree format at -> localhost:"+app.get('port')+"/tree");
  console.log("strategic format at -> localhost:"+app.get('port')+"/strategic");
});

app.get('/', function (req, res) 
{
	res.sendFile('/html/strategic.html',{'root' : '../'});
});

app.get('/tree', function (req, res) 
{
	res.sendFile('/html/index.html',{'root' : '../'});
});


app.get('/strategic', function (req, res) 
{
	res.sendFile('/html/strategic.html',{'root' : '../'});
});

app.post('/solve', function (req, res) 
{
	//solve and return ans
	var matrix = req.body;
	var input = matrix['height'] + " "+matrix['width']+"\n";
	input = input + matrix['player1'] + "\n";
	input = input + matrix['player2'];
	console.log(input);
	var index = gameIndex;
	gameIndex++;
	fs.writeFile("./inputs/game"+index, input, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	    console.log("The input was saved!");
		var process = spawn('./lrslib-061/lrsnash',  ['./inputs/game'+index]);
		process.stdout.on('data', function(data) {
			res.send(data);
			fs.writeFile("./outputs/game"+index, data, function(err) {
			    if(err) {
			        return console.log(err);
			    }
			    console.log("The output was saved!");
			});
		});
	});
});