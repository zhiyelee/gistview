var request = require('request');
var utils = require('./lib/utils');
var router = require('./lib/router');
var path = require('path');

var express = require('express');
var app = express();
app.use(function(req, res, next){
    res.setHeader( 'X-Powered-By', 'Nodejs' );
    next();
});

app.use(express.compress());
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/static"));

router.init(app);

var siteConfig = utils.loadConfig();
app.listen(siteConfig.port);
