'use strict';

var express = require("express");
var jsonParser = require("body-parser").json;
var app = express();

var jsonCheck = function(req, res, next) {
	if(req.body) {
		console.log("The sky is", req.body.color);
	} else {
		console.log("There is no body property on the request");
	}
	next();
}


app.use(jsonCheck);

app.use(jsonParser());

app.use(jsonCheck);





var port = process.env.PORT || 3000;
app.listen(port, function() {
	console.log('Listening on port', port);
});


