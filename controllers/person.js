var uuid = require('node-uuid');

var db = require("mongojs")("refunite", ['people']);

var person = {

	findNames:function(names, callback){

		db.people.find({"name":{$in:names}},function(err, docs){

			callback(err, docs)
		})
	},

	find:function(id, callback){
		
		db.people.findOne({"id":id}, function(err, docs){

			callback(err, docs)
		})		
	},

	new:function(user, callback){

		db.people.find({}).limit(1).sort({_id:-1}).toArray(function (err, lastuser){

			var password = user.password || "";
			var surname = user.surname || "";
			var othernames = user.othernames || "";
			var dob = user.dob || "";
			var email = user.email || "";

			if(!validator.isEmpty(password) &&
				validator.isEmail(email)){

				var data = {

					id 			: lastuser[0].id + 1,
					guid 		: uuid(),
					password 	: sha1(password).toString(),
					email		: email,
					picture 	: "http://placehold.it/32x32",
					tags 		: [],
					friends 	: [],
					registered 	: new Date().toISOString(),
					name 		: surname + ", " + othernames,
					age 		: new Date().getFullYear() - new Date(dob).getFullYear()
				};

				db.people.insert(data, function(err, newuser){

					callback(err, {

						"id":newuser.id,
						"success":true,
						"message":"New user successfully saved!"
					})
				});
			}
			else{

				callback(err,{

					"id":null,
					"success":false,
					"message":"Required password|email!"
				})
			}
		});
	}
}

module.exports = person;