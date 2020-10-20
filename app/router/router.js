const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const controller = require('../controller/controller.js');
	const customers = require('../controller/customer.controller.js');
	const anunciante = require('../controller/controlleranunciante.js');
	const celebridade = require('../controller/controllercelebridade.js');
	const etnia = require('../controller/controlleretnia.js');
	const faixa = require('../controller/controllerfaixa.js');
	const genero = require('../controller/controllergenero.js');
	const pesquisa = require('../controller/controllerpesquisa.js');
	const praca = require('../controller/controllerPraca.js');
	const marca = require('../controller/controllerMarca.js');
	const video = require('../controller/controllerVideo.js');
	const tags = require('../controller/controllerTags.js');
	
	
 
	app.post('/api/auth/registrar', [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], controller.signup);
	
	app.post('/api/auth/logar', controller.signin);

	app.post('/forgot-password', customers.forgotpassword);

	app.get('/forgot-password', customers.forgotpasswordd);
	
	app.get('/',[authJwt.verifyToken], customers.teste);

	app.get('/video', [authJwt.verifyToken],faixa.video);

	app.get('/faixa', [authJwt.verifyToken],faixa.faixa);

	app.get('/etnia',[authJwt.verifyToken], etnia.etnia);

	app.get('/genero',[authJwt.verifyToken], genero.genero);

	app.post('/resumo', [authJwt.verifyToken],pesquisa.pesquisa);
	
	app.post('/praca', [authJwt.verifyToken], praca.praca);

	app.post('/anunciante', [authJwt.verifyToken], anunciante.anunciante);

	app.post('/celebridade', [authJwt.verifyToken], celebridade.celebridade);

	app.post('/marca', [authJwt.verifyToken], marca.marca); 

	app.post('/videos', [authJwt.verifyToken], video.videos);

	app.post('/tags', [authJwt.verifyToken], tags.tags);

	app.get('/video/:id', [authJwt.verifyToken], video.videoById);

	app.post('/reset-passwordd', customers.getresetpassword);

	app.post('/reset-password', customers.resetpassword);
	
	app.get('/api/teste/user', [authJwt.verifyToken], controller.userContent);
	
	app.get('/api/teste/users', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);
	
	app.get('/api/teste/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
}
