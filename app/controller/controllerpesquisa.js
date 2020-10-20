const db = require('../config/db.config.js');
const env = require('../config/env.js');
const filtrosUtil = require('../util/filtros')

exports.pesquisa = async (req, res, next) => {
  //const { id } = req.params;
  try {
    const { QueryTypes } = require('sequelize');

    let body = req.body;
    const replacements = { initDate: body.initDate, endDate: body.endDate, praca:body.praca };

    let variavel = body.filter ? body.filter : [];
    const filtros = filtrosUtil.opcionais(variavel);

    let marca = await db.sequelize.query(`  
      select m.nome, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes
        from veiculacoes_video veic 
          inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
          inner join ${env.spot_reconhecimento}.anunciante a on a.id = mi.anunciante_id 
          inner join ${env.spot_reconhecimento}.marca m on m.id = mi.marca_id
          where veic.data between :initDate and :endDate and veic.praca = :praca 
            ${filtros.sql} ${filtros.sql_h_m} ${filtros.sql_b_n}
        group by 1 
        order by qtd_videos desc 
        limit 0, 5`, { replacements: replacements, type: QueryTypes.SELECT });

    let celebridade = await db.sequelize.query(`select video.celebridade, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes 
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
            limit 0, 5 `, { replacements: replacements, type: QueryTypes.SELECT });

    let anunciante = await db.sequelize.query(`select a.nome, count(distinct(video.id)) qtd_videos, sum(qtd_veiculacoes) qtd_veiculacoes 
            from veiculacoes_video veic 
              inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
              inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
              inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
              inner join ${env.spot_reconhecimento}.anunciante a on a.id = mi.anunciante_id 
              inner join ${env.spot_reconhecimento}.marca m on m.id = mi.marca_id
              where veic.data between :initDate and :endDate and veic.praca = :praca 
                  ${filtros.sql} ${filtros.sql_h_m} ${filtros.sql_b_n}
              group by 1 
              order by qtd_videos desc 
            limit 0, 5`, { replacements: replacements, type: QueryTypes.SELECT });


      let query_etina = `
          sum(if (coalesce(cor_pele_branco, 0) = 1 and coalesce(cor_pele_negro, 0) = 0 and coalesce(cor_pele_outros, 0) = 0, 1, 0)) branco,
          sum(if (coalesce(cor_pele_branco, 0) = 0 and coalesce(cor_pele_negro, 0) = 1 and coalesce(cor_pele_outros, 0) = 0, 1, 0)) negro,
          sum(if (coalesce(cor_pele_branco, 0) = 1 and coalesce(cor_pele_negro, 0) = 1 and coalesce(cor_pele_outros, 0) = 0, 1, 0)) branco_negro`;

      let query_genero = `
          sum(if (coalesce(sexo_m, 0) = 1 and coalesce(sexo_f, 0) = 0, 1, 0)) masculino,
          sum(if (coalesce(sexo_m, 0) = 0 and coalesce(sexo_f, 0) = 1, 1, 0)) feminino,
          sum(if (coalesce(sexo_m, 0) = 1 and coalesce(sexo_f, 0) = 1, 1, 0)) masculino_feminino`;

    let estatistica = await db.sequelize.query(`select count(distinct(id)) qtd, sum(cor_pele_outros) cor_pele_outros, sum(trilha_sonora) trilha_sonora, sum(familia) familia, sum(animais) animais, sum(ciclo_vida_bebe) ciclo_vida_bebe, sum(ciclo_vida_crianca) ciclo_vida_crianca, sum(ciclo_vida_adolescente) ciclo_vida_adolescente, sum(ciclo_vida_adulto) ciclo_vida_adulto, sum(ciclo_vida_idoso) ciclo_vida_idoso, sum(pessoa) pessoa,
        ${query_genero}, ${query_etina}
        from ( select distinct video.id,  video.sexo_m, video.sexo_f, video.cor_pele_branco, video.cor_pele_negro, video.cor_pele_outros, video.trilha_sonora, video.familia, video.animais, video.ciclo_vida_bebe, video.ciclo_vida_crianca, video.ciclo_vida_adolescente, video.ciclo_vida_adulto, video.ciclo_vida_idoso, video.pessoa 
          from veiculacoes_video veic
          inner join ${env.spot_reconhecimento}.video video on video.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.bloco_rec b on b.id = veic.video_id 
          inner join ${env.spot_reconhecimento}.marca_item mi on mi.id = b.marca_item_id 
          inner join ${env.spot_reconhecimento}.anunciante a on a.id = mi.anunciante_id 
          inner join ${env.spot_reconhecimento}.marca m on m.id = mi.marca_id
          where veic.data between :initDate and :endDate and veic.praca = :praca ${filtros.sql} ${filtros.sql_h_m} ${filtros.sql_b_n}) x`, { replacements: replacements, type: QueryTypes.SELECT });

    const percSexo = calcPerc([estatistica[0].masculino, estatistica[0].feminino, estatistica[0].masculino_feminino])
    const ambosSexo = calcPerc([estatistica[0].masculino_feminino, estatistica[0].qtd - estatistica[0].masculino_feminino])

    const percEtnia = calcPerc([estatistica[0].branco, estatistica[0].negro, estatistica[0].branco_negro])
    const ambosEtnia = calcPerc([estatistica[0].branco_negro, estatistica[0].qtd - estatistica[0].branco_negro])

    const trilhaSonora = calcPerc([estatistica[0].trilha_sonora, estatistica[0].qtd - estatistica[0].trilha_sonora])
    const cicloVida = calcPerc([
      estatistica[0].ciclo_vida_bebe, estatistica[0].ciclo_vida_crianca, estatistica[0].ciclo_vida_adolescente,
      estatistica[0].ciclo_vida_adulto, estatistica[0].ciclo_vida_idoso
    ]);
    
    const percPessoa = calcPerc([estatistica[0].pessoa, estatistica[0].qtd - estatistica[0].pessoa])

    estatisticas = {
      sexo: {
        masculino: percSexo[0],
        feminino: percSexo[1],
        ambos: percSexo[2],
      },
      etnia: {
        branco: percEtnia[0],
        negro: percEtnia[1],
        ambos: percEtnia[2]
      },
      trilhaSonora: {
        sim: trilhaSonora[0],
        nao: trilhaSonora[1]
      },
      cicloVida: {
        bebe: cicloVida[0],
        crianca: cicloVida[1],
        adolescente: cicloVida[2],
        adulto: cicloVida[3],
        idoso: cicloVida[4]
      },
      pessoa: {
        sim: percPessoa[0],
        nao: percPessoa[1]
      },
      presencaFamilia: estatistica[0].familia,
      presencaAnimais: estatistica[0].animais,
      total: estatistica[0].qtd
    };

    res.status(200).json({ estatisticas: estatisticas, celebridades: celebridade, anunciantes: anunciante, marca });
  }
  catch (err) {
    next(err);
  }
}

function perc(a, b) {
  return b !== 0 ? a / b * 100 : 0
}

function calcPerc(arr) {
  const soma = arr.reduce((a, b) => Number(a) + Number(b), 0)
  return roundedPerc(arr.map(e => perc(e, soma)))
}

function roundedPerc(arr) {
  // arredondamento fechando 100% utilizando o Largest Remainder Method
  const floorArr = arr.map(e => Math.floor(e))
  const diff = 100 - floorArr.reduce((a, b) => a + b, 0)

  // utiliza ordenação indireta pois previsamos revolver na mesma ordem do array original
  floorArr
    .map((e, i) => i)
    .sort((a, b) => (arr[b] - floorArr[b]) - (arr[a] - floorArr[a]))
    .forEach((e, i) => {
      floorArr[e] = i < diff && arr[i] !== 0 ? floorArr[e] + 1 : floorArr[e]
    })
  return floorArr
}
