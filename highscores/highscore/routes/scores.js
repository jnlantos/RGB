var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	console.log('GET scores');
	var db = req.db;
	var collection = db.get('usercollection');

	var options = {
		'sort': [['score', 'desc']],
		'limit': 5,
	}
		

	collection.find({}, options, function(err, docs){
		res.json(docs);
	});
});

router.post('/', function(req, res){
	console.log('POST score');
	var db = req.db;
	var collection = db.get('usercollection');
	collection.insert(
		{
			"username":req.body.username,
			"score":parseInt(req.body.score)
		}, function(err, doc) {
        if (err) {
            console.error("DB write failed", err);
            res.status(500).send("DB write failed");
        }
    });
});

module.exports = router;