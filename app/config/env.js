const env = {
  database: 'mysql',
  username: 'mysql',
  password: 'root',
  host: 'mysql://fixx:3306',
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
