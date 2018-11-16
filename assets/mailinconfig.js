//here we define the 'on' event listeners for our mailin module
var registerroute 	= require('./register.js');
var checkoutroute 	= require('./checkout.js');
var browseroute		= require('./browse.js');
var transferroute 	= require('./transfer.js');
var nodemailer		= require('nodemailer');//below are our smtp login/pass for SES
var smtpconfig =  {
	host: /*host of proxy*/,
	port: 465,
	secure: true,
	auth: {
		//fill these out
		user:'',
		pass:''
	}
};

var mail = nodemailer.createTransport(/*insert your address here*/);	
module.exports = function(mailin){
	var self = this;
	mailin.on('message', function(connection, data, content){
		//data is our parsed message object
		var sender = data.from[0].address;//get the from field, gives us an array, we need the 0th element
		var body = data.text; //we get the actual body of the message and start parsing it
		console.log(data);
		var tokens = body.split(" ");
		switch(tokens[0].toLowerCase()){
			case "register": registerroute.smtp(tokens,sender, self.response);break;
			case "reserve": checkoutroute.smtp(tokens,sender, self.response);break;
			case "browse": browseroute.smtp(tokens,sender, self.response);break;
			case "transfer": transferroute.smtp(tokens,sender, self.response);break;
			default: self.response(sender, "Error in request, invalid command"); break;
		}
	});
	self.response = function(sender, reply){
		//this is where we will send an email->sms reponse to sender (which is the full address of that phone)
		//this is a callback passed in to the routes
		var mailOps ={
			from: '"Library SMS" <your email here>',
			to: sender,
			subject: 'Library System',
			text: reply,
		};
		mail.sendMail(mailOps, function(err, inf){
			if(err){console.log(err)}
			else{console.log(inf)}
		});
	}
}