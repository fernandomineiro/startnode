const db = require('../config/db.config.js');
const env = require('../config/env.js');
const filtrosUtil = require('../util/filtros')

exports.tags = async (req, res, next) => {
    //const { id } = req.params;
    try {
        const { QueryTypes } = require('sequelize');

        let body = req.body;
        let variavel = body.filter ? body.filter : [];
        const replacements = { initDate: body.initDate, endDate: body.endDate, praca:body.praca };

        const filtros = filtrosUtil.opcionais(variavel);

        const query = 'select video.palavras_chave ' +
            'from ' + env.spot_reconhecimento + '.video video ' +
            'inner join veiculacoes_video veic on video.id = veic.video_id ' +
            'inner join ' + env.spot_reconhecimento + '.bloco_rec b on b.id = video.id ' +
            'inner join ' + env.spot_reconhecimento + '.marca_item mi on mi.id = b.marca_item_id ' +
            'inner join ' + env.spot_reconhecimento + '.marca m on m.id = mi.marca_id ' +
            'left join ' + env.spot_reconhecimento + '.anunciante a on a.id = mi.anunciante_id ' +
            'where veic.data between :initDate and :endDate and veic.praca = :praca ' + filtros.sql + filtros.sql_h_m + filtros.sql_b_n + 
            ' limit 20'

        let videos = await db.sequelize.query(query, { replacements: replacements, type: QueryTypes.SELECT });


        res.status(200).json({ resposta: nuvemPalavra(videos) });
    }
    catch (err) {
        next(err);
    }
}

function nuvemPalavra(palavrasChave) {
    let palavras = [];
  
    palavrasChave.forEach( (item) => {
      let palavras_split = item.palavras_chave.split('\r\n');
  
      palavras_split.forEach( (palavra) => {
        palavra = palavra.trim();
  
        if(palavra != '') {
          let index = palavras.findIndex( (p) => {return p.tag == palavra} );
          if(index === -1) {
            palavras.push({tag: palavra, count: 10});
          } else {
            palavras[index].count ++;
          }
        }
      });
  
    });
  
    return palavras;
  }