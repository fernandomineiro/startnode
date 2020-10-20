const db = require('../config/db.config.js');
const env = require('../config/env.js');

exports.etnia =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');
        const users = await db.sequelize.query(`select a.nome, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes 
        from veiculacoes_video veic 
        inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
        inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
        inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
        inner join ${env.spot_reconhecimento}.anunciante a on a.id = mi.anunciante_id 
        where video.celebridade is not null and video.celebridade <> "" and video.celebridade <> "NULL"
      group by 1 
        order by qtd_videos desc 
        limit 0, 10`, { type: QueryTypes.SELECT });
          res.status(200).json({ resposta:  users});
        }
        catch (err) {
          next(err);
        }  
  }
  