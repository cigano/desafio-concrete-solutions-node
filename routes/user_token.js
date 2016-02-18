var express = require('express');
var jwt = require('jwt-simple');
var router = express.Router();
var moment = require('moment');

/*
 * POST /.
 */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
	
	if (req.headers.authorization === undefined) {
		console.log("Token não existe");
		return res.status(401).send({mensagem: "Não autorizado"});
	} else {
		console.log(req.query);
		var token = req.headers.authorization.replace("Bearer ", "");
		collection.find({ 'email': req.query.email }, {}, function(e, docs) {
			if (docs[0].token != token) {
				console.log("Token inválido.");
				return res.status(401).send({mensagem: "Não autorizado"});
			} else {
				var ultimo_login = moment(docs[0].ultimo_login);
				var agora = moment();
				if (agora.diff(ultimo_login, 'minutes') > 30) {
					console.log("Sessão inválida.");
					return res.status(401).send({mensagem: "Sessão inválida"});
				} else {
					return res.json(docs[0]);
				}
			}
		});
	}
});

module.exports = router;