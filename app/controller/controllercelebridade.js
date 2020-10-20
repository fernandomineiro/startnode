const db = require('../config/db.config.js');
const env = require('../config/env.js');
const filtrosUtil = require('../util/filtros');

exports.celebridade =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');

        let body = req.body;
        let variavel = body.filter ? body.filter : [];
        let limit = body.limit || 10;
        let page = body.page || 0;
    
        const filtros = filtrosUtil.opcionais(variavel);

        const users = await db.sequelize.query(`select video.celebridade nome, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes 
          from veiculacoes_video veic 
          inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
          inner join ${env.spot_reconhecimento}.anunciante a on a.id = mi.anunciante_id 
          inner join ${env.spot_reconhecimento}.marca m on m.id = mi.marca_id
          where video.celebridade is not null and video.celebridade <> "" and video.celebridade <> "NULL" 
          ${filtros.sql} ${filtros.sql_h_m} ${filtros.sql_b_n}
          and veic.data between :initDate and :endDate and veic.praca = :praca    
          group by 1 
          order by qtd_videos desc 
          limit ${page}, ${limit} `, { replacements: { initDate: body.initDate, endDate: body.endDate, praca:body.praca }, type: QueryTypes.SELECT });
          res.status(200).json({ resposta:  users});
        }
        catch (err) {
          next(err);
        }  
  }
  