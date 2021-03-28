const cors = require('cors');
const express = require('express');
let app = express();
app.use(cors());
app.options('*', cors());
app.set('view engine', 'pug');


const nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));



 
require('./app/router/router.js')(app);

const db = require('./app/config/db.config.js');

const Role = db.role;

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'fernandofitilann@hotmail.com',
	  pass: ''
	}
  });
  
// force: true will drop the table if it already exists
//db.sequelize.sync({force: true}).then(() => {
 // console.log('Caso precisar socrinozação... { force: true }');
 // initial();
//});
 
//require('./app/route/project.route.js')(app);
 
// Create a Server
var server = app.listen(3000, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("App listening at http://%s:%s", host, port)
})





