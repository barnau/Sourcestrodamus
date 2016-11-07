'use strict';
var express = require("express");
var router = express.Router();
var Question = require("./models.js").Question;

//Gets trigerred when qID preset in route
router.param("qID", function(req, res, next, id) {
	Question.findById(id, function(err, doc) {
		if (err) return next(err);
		if(!doc) {
			err = new Error("Not Found");
			err.status = 404
			return next(err);
		}
		req.question = doc;
		return next();
	});
});

router.param("aID", function(req, res, next, id) {
	req.answer = req.question.answers.id(id);
	if(!req.answer) {
		err = new Error("Not Found")
		err.status(404);
		return next(err);
	}
	return next();
})

//GET /questions
//Route for questions collection
router.get("/", function(req,res, next) {
	Question.find({})
		.sort({createdAt: -1})
		.exec(function(err, questions) {
			if(err) return next(err);
			res.json(questions);
	});
});

//Post ?questions
//Route for creating questions
router.post("/", function(req ,res, next) {
	var question = new Question(req.body);
	question.save(function(err, question) {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
	
});

//GET /questions/:id
//Route for specific questions

router.get("/:qID", function(req, res, next) {
	res.json(req.question);
});

//POST /questions/:id/answers
//Route for creating an answer
router.post("/:qID/answers", function(req ,res, next) {
	req.question.answers.push(req.body);
	req.question.save(function(err, question) {
		if(err) return next(err);
		res.status(201);
		res.json(question);
	});
	
});

//PUT /questions/:id/answers/:id
//Edit a specific answer
router.put("/:qID/answers/:aID", function(req, res) {
	req.answer.update(req.body, function(err, result) {
		if(err) return next(err);
		res.json(result);
	});
})

router.delete("/:qID", function(req, res) {
	req.question.remove(function(err) {
		if(err) return next(err);
		res.json(req.question);
	})
})

//DELETE /questions/:id/answers/:id
//Delete a specific answer
router.delete("/:qID/answers/:aID", function(req, res) {
	req.answer.remove(function(err) {
		req.question.save(function(err, question) {
			if(err) return next(err);
			res.json(question);
		})
	})
})

//POST /questions/:id/answers/:id/vote-up
//POST /questions/:id/answers/:id/vote-down
//Vote on a specific answer
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next) {
	if(req.params.dir.search(/^up|down$/) === -1) {
		var err = new Error("Not Found");
		err.status = 404;
		next(err);
	} else {
		req.vote = req.params.dir;
		next();
	}
}, 
function(req, res) {
	req.answer.vote(req.vote, function(err, question, next) {
		if(err) return next(err);
		res.json(question);
	})
	
})

module.exports = router;