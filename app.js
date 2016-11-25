var express = require('express');
const app = express();
var net = require('net');

const PORT = process.env.npm_package_config_port || 4422;
console.log(`trying to create app on port ${PORT}...`);


app.use('/dist', express.static(__dirname + '/dist'));
app.use('/views', express.static(__dirname + '/views'));

app.get('*', function(req, res){
	if(/^\/(dist|views|browser-sync)/.test(req.url)){
		res.status(404).send('Sorry cant find that!');
		return false;
	}

	res.sendFile(__dirname + '/index.html');
})

app.listen(PORT, function () {
	console.log(`FF listening on port ${PORT}!`);
});
