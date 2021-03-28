const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const controller = require('../controller/controller.js');
	const customers = require('../controller/customer.controller.js');
	const video = require('../controller/controllerVideo.js');

	app.post('/denunciar', video.denuncia);

	app.post('/arquivo/:id', video.arquivo);

	app.post('/imagem/:id', video.imagem);

	app.post('/ip/:id', video.ip);
 
	app.post('/api/auth/registrar',[verifySignUp.checkDuplicateUserNameOrEmail], controller.signup);
	
	app.post('/api/auth/logar', controller.signin);

	app.post('/forgot-password', customers.forgotpassword);

	app.get('/forgot-password', customers.forgotpasswordd);

	app.get('/api/teste/user', [authJwt.verifyToken], controller.userContent);
	
	app.get('/api/teste/users', [authJwt.verifyToken, authJwt.isPmOrAdmin], controller.managementBoard);
	
	app.get('/api/teste/admin', [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);

	app.get('/whats', video.whats);

	app.post('/add', video.add);

	app.post('/', video.email);

	app.get('/', video.get);  

	app.get('/teste/:ip', video.ip);
	
	app.get('/usuario/:id', controller.getusuario);
	
	app.put('/usuario/:id' ,controller.putusuario);
	
	app.put('/usuario/user/:id' ,controller.putusuariosenha);

}