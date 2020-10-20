const db = require('../config/db.config.js');

exports.faixa =  async (req, res, next) => {
    //const { id } = req.params;
    try{
        const { QueryTypes } = require('sequelize');
        let userId = req.body.userId;

        const faixa = await db.sequelize.query(`select p.* from praca p 
            inner join user_praca up on up.praca_id = p.codigo
            WHERE up.user_id = ${userId}`, { type: QueryTypes.SELECT });
          res.status(200).json({ resposta:  faixa});
        }
        catch (err) {
          next(err);
        }  
  }


exports.video =  async (req, res, next) => {
  //const { id } = req.params;
  try{
      const { QueryTypes } = require('sequelize');
      const users = await db.sequelize.query(`select count(distinct(id)) qtd, sum(sexo_m) sexo_m, sum(sexo_f) sexo_f, sum(cor_pele_branco) cor_pele_branco, sum(cor_pele_negro) cor_pele_negro, sum(cor_pele_outros) cor_pele_outros, sum(trilha_sonora) trilha_sonora, sum(familia) familia, sum(animais) animais, sum(ciclo_vida_bebe) ciclo_vida_bebe, sum(ciclo_vida_crianca) ciclo_vida_crianca, sum(ciclo_vida_adolescente) ciclo_vida_adolescente, sum(ciclo_vida_adulto) ciclo_vida_adulto, sum(ciclo_vida_idoso) ciclo_vida_idoso 
      from ( select distinct video.* from veiculacoes_video veic 
        inner join video video on video.id = veic.video_id 
        inner join bloco_rec b on b.id = veic.video_id 
        inner join marca_item mi on mi.id = b.marca_item_id 
        inner join anunciante a on a.id = mi.anunciante_id 
        )X`, { type: QueryTypes.SELECT });
        res.status(200).json({ resposta:  users});
      }
      catch (err) {
        next(err);
      }  
}