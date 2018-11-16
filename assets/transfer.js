//this is for transfer books
var Book = require('./schemas.js').BOOKSCHEMA;
var User = require('./schemas.js').USERSCHEMA;

exports.http = function(req, res){
	res.send("checkoutsystem");
}
//to request a transfer, person sends transfer request <bookid>
//to approve a transfer, person sends transfer response <bookid> yes/no
//if no, we need to alert the requester that their request was denied. 
//if yes, we send the numbers to each other and they work out the details. 
//we will want to mark the book as pending transfer - any member can send 
//transfer cancel <bookid> to cancel the request. 
//once book is transferred, both users need to send transfer complete <bookid>
exports.smtp = function(tokens,sender, response){
	var bookid = tokens[2];//we need to check if this person is registered
	User.find({phone_number:sender.split('@')[0]}, funtion(err, person){
		if(err){
			return response(sender, "Error retrieving user");
		}
		if(!person){
			return response(sender, "User does not exist");
		}
		Book.findOne({book_id:tokens[2]}, function(err, docs){
			if(err){
				console.log(err);
				return response(sender, "Error retrieving book");
			}
			if(!docs){
				return response(sender, "Book does not exist");
			}
			if(tokens[1].toLowerCase()=="request"){
				if(!docs.checked_out){//book is not checked out
					return response(sender, "Book is not checked out - no transfer required");
				}
				if(docs.transfer_requested){//someone has already requested a transfer
					return response(sender,"Book has already been requested for transfer by someone else");
				}
				if(person.phone_number == sender.split('@')[0]){
					return response(sender,"You have checked out this book!")
				}
				docs.requestTransfer(sender,person,function(err,status){//we can go ahead and initiate the transfer
					if(err){//need to put requesters number and object id in the thing as well as the boolean
						response(docs.checked_out_by_number, "Someone would like to request a transfer for "+dics.book_id
						+". Respond with Transfer Response "+dics.book_id+" yes/no");
						return response(sender, "Error with transfer");
					}
					return response(sender, "Transfer successfully requested");
				});
			}	
			if(tokens[1].toLowerCase()=="response"){
				if(person._id == docs.checked_out_by){//the person replying is the current holder of the book
					var reply = tokens[3];
					if(tokens[3].toLowerCase()=="yes"){
						//we need to send the numbers to each person
						response(sender, "Requester number is "+docs.transfer_requester_number);
						return response(docs.transfer_requester_address,"Holder number is " + sender.split('@')[0]);
					}
					if(tokens[3].toLowerCase()=="no"){
						//we alert the requester and confirm with owner
						docs.cancelRequest(function(err){
							if(err){
								console.log(err); 
								return response(sender, "Server Error");
							}
							response(sender, "Request successfully denied");
							return response(docs.transfer_requester_address,"Request denied by book holder");
						});//basically jsut resets requester info and the requested boolean
					}
					return response(sender, "Invalid Command");
				}
				return response(sender,"You are not the current holder of this book!");
				
			}
			if(tokens[1].toLowerCase()=="cancel"){
				if(sender.split('@')[0]==docs.transfer_requester_number){
					docs.cancelRequest(function(err){
						if(err){
							console.log(err); 
							return response(sender, "Server Error");
						}
						response(docs.transfer_requester_address, "Transfer request canceled");
						return response(docs.checked_out_by_address, "Transfer request canceled");
					});
				}
			}
			if(tokens[1].toLowerCase()=="complete"){
				//we will need to make sure both involved parties sent this in order to finalize
				docs.complete(function(err, status){
					if(err){
						return response(sender, "Server Error");
					}
					if(status == "unconfirmed"){
						return response("Waiting on other person to confirm");
					}
					if(status == "confirmed"){
						return response("Transfer Confirmed")
					}
				});
			}
			return response(sender, "Invalid Command");				
		});
	});
}