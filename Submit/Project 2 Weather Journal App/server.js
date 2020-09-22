// Setup empty JS object to act as endpoint for all routes
const projectData = [];

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port, listening);

// Callback to debug
function listening() {
  console.log(`Server Running on Port: ${port}`);
};

//Initialize all route with callback function
app.get('/all', sendData)

// Callback function to complete GET '/all'
function sendData(request, response) {
  console.log('sendData()');
  console.log(projectData);
  response.send(projectData);

}

// Post Route
app.post('/add', addData);

function addData(request, response) {
  projectData.push(request.body);
  console.log('addData()');
  console.log(request.body);
  response.send(request.body);

}
