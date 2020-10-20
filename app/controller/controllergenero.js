const db = require('../config/db.config.js');

exports.genero =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');
        const users = await db.sequelize.query("SELECT SUM(sexo_m) AS m, SUM(sexo_f) AS f FROM video;", { type: QueryTypes.SELECT });
          res.status(200).json({ resposta:  users});
        }
        catch (err) {
          next(err);
        }  
  }
  