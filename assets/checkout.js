//this is for checking out books
var Book = require('./schemas.js').BOOKSCHEMA;
var User = require('./schemas.js').USERSCHEMA;

exports.http = function(req, res){
	res.send("checkoutsystem");
}
//we are expecting reserve <bookid>
exports.smtp = function(tokens,sender, response){
	var book = tokens[1];
	var phone = sender.split('@')[0];
	//first we need make sure this user exists
	User.findOne({phone_number:sender}, function(err, person){
		if(err){
			console.log(err);
			return response(sender, "Error retrieving user");
		}
		if(!person){
			return response(sender, "User does not exist");
		}
		//user is valid
		//we will need to make sure the book is not checked out
		//and it exists
		Book.findOne({book_id: book}, function(err, item){
			if(err){//there is error
				console.log(err);
				return response(sender, "Error retrieving book");
			}
			if(!item){//result is null
				return response(sender, "Book does not exist");
			}
			if(item.checked_out){//book is checked out
				return response(sender, "Book is already checked out. Use 'Transfer Request <bookid>' to request a transfer from the current user");
			}
			//we havent returned so lets continue
			item.checkOut(person._id, function(err){
					if(err){
						return response(sender, "Error checking out book");
					}
					person.checkOut(item._id, function(err){
						if(err){
							return response(sender, "Error checking out book");
						}
						return response(sender, "You have reserved "+item.title+".");
					});
			});
		});
	});
	console.log(tokens);
	console.log(sender);
	
}