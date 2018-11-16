var express = require("express"); //load the express module
var app 	= express(); //create our http server
//if use gsm, open up http, create script handler for gsm dongle SMS to POST and comment out mailin
//set api stuff
/*
var registerRouter = express.Router();
require('registerroute.js')(registerRouter);
app.use('/register',registerRouter);

var checkoutRouter = express.Router();
require('checkoutroute.js')(checkoutRouter);
app.use('/checkout', checkoutRouter);

var transferRouter = express.Router();
require('transferroute.js')(transferRouter);
app.use('/transfer', transferRouter);

var browseRouter = express.Router();
require('browseroute.js')(browseRouter);
app.use('/browse', browseRouter);
*/
//the above is reserved for if we have to provide support for a 
//middleman sms gateway service to post to our servers - this is 
//a backup system and should by no means be considered as a first
//choice for initial deployment

var mongoose	= require('mongoose'); //load the mongoose module
var mailin 		= require('mailin');//load mailin module
var httpPort 	= process.env.HTTP_PORT || 80;
app.use(express.static('/Shared/Server/assets'));//tell node where we want to serve
//static content like css files from
app.get('/', function(req,res){
	res.render('index.html');
});//this is where our homepage will live
app.set('views','./assets');
mongoose.connect('localhost','liberia');
//initialize mailin module
require('./assets/mailinconfig.js')(mailin);//our mailin.on functions live here
//start mailin
mailin.start({
	port: 25,
	disableWebhook: true
});
//  start the server
app.listen(httpPort, function(){
	console.log("woooooo");//so we know its running
});
