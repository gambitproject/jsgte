var express = require('express')
var app = express();
var bodyParser = require('body-parser');
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
	res.send("ans");
	console.log(req.body);
});