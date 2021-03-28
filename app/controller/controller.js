const db = require('../config/db.config.js');
const config = require('../config/config.js');
const User = db.user;
const Role = db.role;
 
const Op = db.Sequelize.Op;

var jwt = require('jsonwebtoken'); 
var bcrypt = require('bcryptjs');

 exports.signup = async (req, res, next) => {
	try {
	const { QueryTypes } = require('sequelize');
	console.log("Processing func -> SignUp");
	
	console.log(req.body.senha)
	
		 const name = req.body.nome;
		 const date = req.body.dataNascimento;
		 const endereco = req.body.endereco;
		 const tell = req.body.telefone;
		 const cpf = req.body.cpf;
		 const tipodeacesso = req.body.tipoAcesso;
		 const email = req.body.login;
		 const password = bcrypt.hashSync(req.body.senha, 8);
		 const created = '2021-03-25 13:57:39'
	
		 const pracas = await db.sequelize.query(`INSERT INTO users (name, date, endereco, tell, cpf, tipodeacesso, email, password, createdat, updatedat)
		 VALUES ('${name}', '${date}', '${endereco}', '${tell}', '${cpf}', '${tipodeacesso}', '${email}', '${password}', '${created}', '${created}')`, { type: QueryTypes.INSERT });
	   res.status(200).json({ resposta:  'ok'});

	}
	catch (err) {
        next(err);
    }
}



exports.signin = (req, res) => {
	console.log("Sign-In");
	
	User.findOne({
		where: {
			email: req.body.login
		}
	}).then(user => {
		if (!user) {
			return res.status(404).send('Usuario não encontrado.');
		}

		var passwordIsValid = bcrypt.compareSync(req.body.senha, user.password);
		if (!passwordIsValid) {
			return res.status(401).send({ auth: false, accessToken: null, reason: "Senha inválida!" });
		}
		
		var token = jwt.sign({ id: user.id }, config.secret, {
		  expiresIn: 86400 
		});
		
		res.status(200).send({ auth: true, accessToken: token, acesso: user.tipodeacesso, id: user.id });
		
	}).catch(err => {
		res.status(500).send('Error -> ' + err);
	});
}

exports.userContent = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Página de conteúdo do usuário",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Não é possível acessar a página do usuário",
			"error": err
		});
	})
}

exports.adminBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "Admin painel",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Não é possível acessar o painel do admin",
			"error": err
		});
	})
}

exports.managementBoard = (req, res) => {
	User.findOne({
		where: {id: req.userId},
		attributes: ['name', 'username', 'email'],
		include: [{
			model: Role,
			attributes: ['id', 'name'],
			through: {
				attributes: ['userId', 'roleId'],
			}
		}]
	}).then(user => {
		res.status(200).json({
			"description": "administrativo",
			"user": user
		});
	}).catch(err => {
		res.status(500).json({
			"description": "Não pode acessar o administrativo",
			"error": err
		});
	})
}

 exports.getusuario = async (req, res, next) => {
	try {
	const { QueryTypes } = require('sequelize');
	console.log("Processing func -> getusuario");
	let id = req.params.id;
	
	
	
	
		 const pracas = await db.sequelize.query(`SELECT * FROM users WHERE id = ${id}`, { type: QueryTypes.SELECT });
	   res.status(200).json({ resposta:  pracas});

	}
	catch (err) {
        next(err);
    }
}

exports.putusuario = async (req, res, next) => {
	try {
	const { QueryTypes } = require('sequelize');
	console.log("Processing func -> putusuario");
	let id = req.params.id;
	
	const name = req.body.nome;
		 const date = req.body.dataNascimento;
		 const endereco = req.body.endereco;
		 const tell = req.body.telefone;
		 const cpf = req.body.cpf;
		 const email = req.body.login;
		 
		 const a = '2021-03-25 13:57:39';
	
	
	
	
		 const pracas = await db.sequelize.query(`UPDATE users SET name = '${name}', date = '${date}', endereco = '${endereco}', tell = '${tell}', cpf = '${cpf}', email = '${email}',  updatedAt = '${a}'  WHERE id = ${id}`, { type: QueryTypes.UPDATE });
	   res.status(200).json({ resposta:  pracas});

	}
	catch (err) {
        next(err);
    }
}

exports.putusuariosenha = async (req, res, next) => {
	try {
	const { QueryTypes } = require('sequelize');
	console.log("Processing func -> putusuariosenha");
	let id = req.params.id;
	
	const password = bcrypt.hashSync(req.body.novaSenha, 8);
	
	
	
	
		 const pracas = await db.sequelize.query(`UPDATE users SET password = '${password}' WHERE id = ${id}`, { type: QueryTypes.UPDATE });
	   res.status(200).json({ resposta:  pracas});

	}
	catch (err) {
        next(err);
    }
}





