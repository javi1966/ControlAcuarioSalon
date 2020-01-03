const express = require('express');


// Express app
var app = express();
// Use public directory
app.use(express.static('www'));


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/www');
});


// Start server
let server = app.listen(3030, () => {
    console.log('Control Acuario Salon,puerto %d', server.address().port);
});
