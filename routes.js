'use strict';
var express = require("express");
var router = express.Router();

//GET /questions
//Route for questions collection
router.get("/", function(req,res) {
	res.json({
		response: "You sent me a get request"
	})
});

//Post ?questions
//Route for creating questions
router.post("/", function(req ,res) {
	res.json({
		response: "You sent me a post request",
		body: req.body
	})
});

//GET /questions/:id
//Route for specific questions

router.get("/:id", function(req,res) {
	res.json({
		response: "You sent me a get request for ID: " + req.params.id
	})
});


module.exports = router;