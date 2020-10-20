const db = require('../config/db.config.js');
const env = require('../config/env.js');
const filtrosUtil = require('../util/filtros')

exports.marca =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');
        
        let body = req.body;
        let variavel = body.filter ? body.filter : [];
        let limit = body.limit || 10;
        let page = body.page || 0;
    
        const filtros = filtrosUtil.opcionais(variavel);

        let marca = await db.sequelize.query(`  
            select m.nome, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes
                from veiculacoes_video veic 
                inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
                inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
                inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
                inner join ${env.spot_reconhecimento}.marca m on m.id = mi.marca_id
                where veic.data between :initDate and :endDate and veic.praca = :praca 
                    ${filtros.sql} ${filtros.sql_h_m} ${filtros.sql_b_n}
                group by 1 
                order by qtd_videos desc 
                limit ${page}, ${limit}`, { replacements: { initDate: body.initDate, endDate: body.endDate, praca:body.praca }, type: QueryTypes.SELECT });

          res.status(200).json({ resposta:  marca});
        }
        catch (err) {
          next(err);
        }  
  }