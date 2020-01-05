const express = require('express');

const PORT = process.env.PORT || 3030;


// Express app
var app = express();
// Use public directory
app.use(express.static('www'));


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/www');
});


// Start server
let server = app.listen(PORT, () => {
    console.log('Control Acuario Salon,puerto %d', server.address().port);
});
