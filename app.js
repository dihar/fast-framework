const express = require('express');
const net = require('net');
const fs = require('fs');

var app = express();

///bootstraping application///

setUpApp(app);
getPort().then(port => startApp(app, port));

//////


function setUpApp(app){
	app.use('/dist', express.static(__dirname + '/dist'));
	app.use('/views', express.static(__dirname + '/views'));
	app.use('/config', express.static(__dirname + '/config'));

	app.get('*', function(req, res){
		if(/^\/(dist|views|browser-sync|favicon\.ico)/.test(req.url)){
			res.status(404).send('Sorry cant find that!');
			return false;
		}
		res.sendFile(__dirname + '/index.html');
	})
}

function getPort(){
	return new Promise((res, rej)=>{
		var packPort = process.env.npm_package_config_port;
		if(packPort){
			res(packPort);
		} else{
			fs.readFile(__dirname + '/package.json', 'utf8', function(err, data){
				if(err) throw err;
				var packageJSON = JSON.parse(data);
				if(!packageJSON.config){
					packageJSON.config = {};
				}
				res(packageJSON.config.port || 4420);
			});
		}
	});
}

function startApp(app, port = 4422){
	console.log(`trying to create app on port ${port}...`);
	app.listen(port, function () {
		console.log(`FF listening on port ${port}!`);
	});
}