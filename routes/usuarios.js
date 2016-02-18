var express = require('express');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
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
	var parsed_req = JSON.parse(JSON.stringify(req.body));
	
	collection.find({ 'email': parsed_req.email }, {}, function(e, docs) {
		console.log(docs);
		if (docs.length > 0) {
			console.log("E-Mail já existente");
			return res.send({mensagem: "E-Mail já existente"});
		} else {
			var novo_usuario = {};
	
			novo_usuario.nome = parsed_req.nome;
			novo_usuario.email = parsed_req.email;
			
			var salt = bcrypt.genSaltSync(10);
			novo_usuario.senha = bcrypt.hashSync(parsed_req.senha, salt);
			
			novo_usuario.telefones = parsed_req.telefones;
			novo_usuario.data_criacao = new Date();
			novo_usuario.data_atualizacao = new Date();
			novo_usuario.ultimo_login = new Date();
			novo_usuario.token = jwt.encode(parsed_req.email, "concrete-solutions");
			
			collection.insert(novo_usuario, function(err, result){
				res.send(
					(err === null) ? novo_usuario : { msg: err }
				);
			});
		}
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
