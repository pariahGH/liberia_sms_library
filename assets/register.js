//this is for registration
var User = require('./schemas.js').USERSCHEMA;

exports.http = function(req, res){
	var desire = req.body;
	//expect req.body to look like: 
	/*
	{
		sender: String,
		message: String
	}
	var sender = desire.sender //this is the number itself, dont split it!
	var tokens = desire.message.split(' ');
	*/

}

exports.smtp = function(tokens,sender, response){
	var self = this;
	//we need to create a new user object in the database - first we will need to query to check if 
	//a user with this phone number already exists
	User.findOne({'phone_number':sender.split('@')[0]},'first_name', function(err, result){
		if(result != null){//there will be a resule if this number has already been registered
			response(sender, "You have already registered");//we may need to implement further handling here depending on possible errors
		}
		else{//otherwise, we need to add this person
			console.log(err);
			console.log(result);
			var u = new User({first_name: tokens[1], last_name: tokens[2], phone_number: sender.split('@')[0]});
			u.save(function(err){
				if(!err){
					//operation successful, we tell the client that they are good to go
					console.log("successfully registered " + sender);
					response(sender, "Registration Successful!");
				}else{
					console.log(err);
					response(sender, "Regisration Unsuccesful - please try again")
				}
			});
		}
	});
}