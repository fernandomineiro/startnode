const db = require('../config/db.config.js');
const env = require('../config/env.js');

exports.praca =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');

        let userId = req.body.userId;

        const pracas = await db.sequelize.query(`select p.* from ${env.spot_reconhecimento}.praca p 
            inner join user_praca up on up.praca_id = p.codigo
            WHERE up.user_id = ${userId}`, { type: QueryTypes.SELECT });
          res.status(200).json({ resposta:  pracas});
    } catch (err) {
        next(err);
    }  
}