module.exports = (sequelize, Sequelize) => {
	const ResetToken = sequelize.define('ResetTokens', {
	  email: {
		  type: Sequelize.STRING
	  },
	  token: {
		  type: Sequelize.STRING
	  },
	  expiration: {
		  type: Sequelize.DATE
	  },
	  used: {
		  type: Sequelize.INTEGER
	  }
	});
	
	return ResetToken;
}