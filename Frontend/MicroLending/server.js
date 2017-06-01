var https = require('https');
var fs = require('fs');
var express = require('express');
var credentials = {

  key: fs.readFileSync(__dirname+ '/certs/private.key'),
  cert: fs.readFileSync(__dirname+ '/certs/certificate.crt')
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
    res.sendfile("www/index.html");
});

//app.listen(8100);
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8100);

console.log('Rest Server listening on port 8100');