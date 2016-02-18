var express = require('express');
var router = express.Router();

/*
 * GET /.
 */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to /.
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
	var myObject = JSON.parse(JSON.stringify(req.body));
	console.log(myObject);
	
    collection.insert(myObject, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to delete.
 */
router.delete('/delete/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

module.exports = router;
