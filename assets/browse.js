//this is for browse  books

exports.http = function(req, res){
	res.send("checkoutsystem");
}

exports.smtp = function(tokens,sender, response){
	console.log(tokens);
	console.log(sender);
	
}