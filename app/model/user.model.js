module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('users', {
	  name: {
		  type: Sequelize.STRING
	  },
	  date: {
		  type: Sequelize.STRING
	  },
	  endereco: {
		  type: Sequelize.STRING
	  },
	  tell: {
		type: Sequelize.STRING
	  },
	  cpf: {
		type: Sequelize.STRING
	  },
	  tipodeacesso: {
		type: Sequelize.STRING
	  },
	  email: {
		type: Sequelize.STRING
	  },
	  password: {
		  type: Sequelize.STRING
	  }
	});
	
	return User;
}