var https = require('https');
var fs = require('fs');
var express = require('express');

var credentials = {
    // Private key of the server
    key: fs.readFileSync(__dirname+'/certs/New_Wildcard_Persistent_in-key.pem'),
    // Public key of the server (certificate key)
    cert: fs.readFileSync(__dirname+'/certs/New_Wildcard_Persistent_in-cert.pem'),

    // Request a certificate from a connecting client
    requestCert: true, 

    // Automatically reject clients with invalide certificates.
    rejectUnauthorized: true             // Set false to see what happens.
	
};

app = express();
app.use("/www", express.static(__dirname + '/www'));
app.use("/js", express.static(__dirname + '/www/js'));
app.use("/lib", express.static(__dirname + '/www/lib'));
app.use("/css", express.static(__dirname + '/www/css'));
app.use("/img", express.static(__dirname + '/www/img'));
app.use("/templates", express.static(__dirname + '/www/templates'));


 //apiUrl ="http://10.51.224.253:9095/";

// define the root for the single page.
app.get('/', function (req, res) {
	console.log("hello")
    res.sendfile("www/index.html");
});

//app.listen(8100);
var httpsServer = https.createServer(credentials, function(req,res){

	console.log("hello");
});
httpsServer.listen(8000,'hj-ctocto1334');

console.log('Rest Server listening on port 8000');