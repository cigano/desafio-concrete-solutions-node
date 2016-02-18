var express = require('express');
var jwt = require('jwt-simple');
var bcrypt = require('bcrypt');
var router = express.Router();

/*
 * POST to /.
 */
router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
	
	var parsed_req = JSON.parse(JSON.stringify(req.body));
	
    collection.find({ email: parsed_req.email },{},function(e,docs){
		console.log(parsed_req);
        if (docs.length <= 0) {
			console.log("Usuário inválido");
			return res.send({mensagem: "Usuário e/ou senha inválidos"});
		} else {
			bcrypt.compare(parsed_req.senha, docs[0].senha, function(err, result) {
				if (!result) {
					console.log("Senha inválida");
					return res.status(401).send({mensagem: "Usuário e/ou senha inválidos"});
				} else {
					var date_login = new Date();
					collection.update(docs[0]._id, { $set: { ultimo_login : date_login }}, function(err) {});
					docs[0].ultimo_login = date_login;
					return res.send(docs[0]);
				}
			});
		}
    });
});

module.exports = router;