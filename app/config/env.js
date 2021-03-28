const env = {
  database: 'fernandofolia',
  username: 'fernandofolia',
  password: 'fernandofolia1',
  port: '41890',
  host: 'mysql743.umbler.com',
  dialect: 'mysql',
  pool: {
	  max: 5,
	  min: 0,
	  acquire: 30000,
	  idle: 10000
  }
};

// const env = {
//   database: 'adexcreative',
//   username: 'adexcreative',
//   password: 'creative',
//   host: '192.168.200.17',
//   spot_reconhecimento: 'spot_reconhecimento',
//   dialect: 'mysql',
//   pool: {
// 	  max: 5,
// 	  min: 0,
// 	  acquire: 30000,
// 	  idle: 10000
//   }
// };
 
module.exports = env;
