const express = require('express');
const axios = require('axios');


const PORT = process.env.PORT || 3030;


// Express app
var app = express();
// Use public directory
app.use(express.static('www'));


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/www');
});

app.get('/temp', async (req,res) => {

    let temp = await axios.get('http://192.168.1.220/temp');
    console.log("Temperatura desde Server: "+temp.data.temperatura);
    res.json(temp.data);
});

app.get('/status',async (req,res) => {

     let stat= await axios.get('http://192.168.1.220/status');

     console.log(stat.data);

     res.json(stat.data);

});

app.get('/luzon',async (req,res) => {

    let stat= await axios.get('http://192.168.1.220/luzon');

    console.log(stat.data);

    res.json(stat.data);

});

app.get('/luzoff',async (req,res) => {

    let stat= await axios.get('http://192.168.1.220/luzoff');

    console.log(stat.data);

    res.json(stat.data);

});

app.get('/aireon',async (req,res) => {

    let stat= await axios.get('http://192.168.1.220/aireon');

    console.log(stat.data);

    res.json(stat.data);

});

app.get('/aireoff',async (req,res) => {

    let stat= await axios.get('http://192.168.1.220/aireoff');

    console.log(stat.data);

    res.json(stat.data);

});




// Start server
let server = app.listen(PORT, () => {
    console.log('Control Acuario Salon,puerto %d', server.address().port);
});
