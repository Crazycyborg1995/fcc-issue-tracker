'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var expect = require('chai').expect;
var cors = require('cors');
var hbs = require('express-handlebars').create({ defaultLayout: 'main' });
var apiRoutes = require('./routes/api.js');
var fccTestingRoutes = require('./routes/fcctesting.js');
var runner = require('./test-runner');
var port = process.env.PORT || 3000;
var app = express();
var helmet = require('helmet');
const session = require('express-session');

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors());

// Express Handlebars
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Helmet
app.use(helmet.xssFilter());
app.use(helmet.noSniff());

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Express Sessions
app.use(
  session({
    secret: 'secretKey',
    saveUninitialized: false,
    resave: false
  })
);

//Routes
app.route('/').get(function(req, res) {
  res.render('index');
});

app.route('/project/').get(function(req, res) {
  res.render('issues', {
    users: req.session.users || ''
  });
});

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API
apiRoutes(app);
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.sendFile(path.join(__dirname + '/public/404.html'));
});

//Start our server and tests!
app.listen(port, function() {
  console.log('Listening on port ' + port);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(function() {
      try {
        runner.run();
      } catch (e) {
        var error = e;
        console.log('Tests are not valid:');
        console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
