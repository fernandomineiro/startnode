const env = {
  database: 'karamb48_node',
  username: 'karamb48_node',
  password: 'Node123',
  host: '108.179.252.60',
  spot_reconhecimento: 'karamb48_node',
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
