const db = require('../config/db.config.js');
const config = require('../config/config.js');
const ROLEs = config.ROLEs; 
const User = db.user;
const Role = db.role;

checkDuplicateUserNameOrEmail = (req, res, next) => {
	
	User.findOne({
		where: {
			name: req.body.nome
		} 
	}).then(user => {
		if(user){
			res.status(200).json({ resposta:  'Nome já em uso'});
			return;
		}
		
		// -> Check Email is already in use
		User.findOne({ 
			where: {
				email: req.body.login
			} 
		}).then(user => {
			if(user){
				res.status(200).json({ resposta:  'email já em uso'});
				
				return;
			}
				
			next();
		});
	});
}

checkRolesExisted = (req, res, next) => {
		
	for(let i=0; i<req.body.roles.length; i++){
		if(!ROLEs.includes(req.body.roles[i].toUpperCase())){
			res.status(400).send("Fail -> Não existe = " + req.body.roles[i]);
			return;
		}
	}
	next();
}

const signUpVerify = {};
signUpVerify.checkDuplicateUserNameOrEmail = checkDuplicateUserNameOrEmail;
signUpVerify.checkRolesExisted = checkRolesExisted;

module.exports = signUpVerify;