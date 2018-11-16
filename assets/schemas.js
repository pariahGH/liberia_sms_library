var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	first_name: String,
	last_name: String,
	phone_number: Number,
	phone_address: String,
	//we always expect the above! below willb e empty initially
	last_command: {type: String, default: null},
	checked_out: {type: [Schema.Types.ObjectId], default: []}
})

var bookSchema = new Schema({
	title: String,
	genre: String,
	author: {type: [String], default:[]},
	//do we have only one of each? should we have each copy of a book be a seperate entry or just keep a count of how many there are and how many are checked out?
	//we generate a QR code from the objectid string, thats what is used to reference each individual instance - when getting a count of how many of a copy there are,w e jsut count 
	//all with same title and author as the first one that we found
	book_id: {type: String, default: function(){
		//generate the 4 byte epoch + 2 byte rand and return the hexdec
	}},//this is what will uniquely identify a book
	isbn_code: String,
	publisher: String,
	checked_out: {
		type: Boolean,
		default: false
	},
	checked_out_by: {
		type: Schema.Types.ObjectId,
		default: null
	},
	checked_out_by_number: {
		type: String,
		default: ''
	},
	checked_out_by_address:{
		type: String,
		default: ''
	},
	transfer_requested{
		type: Boolean,
		default: false
	},
	transfer_confirmation: {
		type: Boolean,
		default: false//if this is true, then one of the two people have confirmed the transfer
	},
	transfer_requester: {//person requesting transfer
		type: Schema.Types.ObjectId,
		default: null
	}
	transfer_requester_number: {
		type: String,
		default: ''
	},
	transfer_requester_address: {
		type: String,
		default: ''
	}
})

userSchema.methods.checkOut = function(bookId, errResponse){
	this.check_out.push(bookId);
	this.save(function(err){
		if(err){
			console.log(err);
			return errResponse(err);
		}
		return errResponse(null);
	});
}

bookSchema.methods.checkOut = function(personId, errResponse){
	this.checked_out = true;
	this.checked_out_by = personId;
	this.save(function(err){
		if(err){
			console.log(err);
			return errResponse(err);
		}
		return errResponse(null);
	});
}
exports.USERSCHEMA = mongoose.model('User', userSchema);
exports.BOOKSCHEMA = mongoose.model('Book',bookSchema);