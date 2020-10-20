const db = require('../config/db.config.js');
const env = require('../config/env.js');
const filtrosUtil = require('../util/filtros')

exports.videoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { QueryTypes } = require('sequelize');
        
        const query = 'select video.id, video.celebridade, a.nome anunciante, m.nome marca, b.duracao, ' +
            'b.primeira_veic, video.transcricao, video.palavras_chave ' +
            'from ' + env.spot_reconhecimento + '.video video ' +
            'inner join ' + env.spot_reconhecimento + '.bloco_rec b on b.id = video.id ' +
            'inner join ' + env.spot_reconhecimento + '.marca_item mi on mi.id = b.marca_item_id ' +
            'inner join ' + env.spot_reconhecimento + '.marca m on m.id = mi.marca_id ' +
            'left join ' + env.spot_reconhecimento + '.anunciante a on a.id = mi.anunciante_id ' +
            'where video.id = :id'

        let video = await db.sequelize.query(query, { replacements: { id: id }, type: QueryTypes.SELECT });

        if(video.length) {
            video[0].palavras_chave = video[0].palavras_chave.split("\r\n");
        }

        res.status(200).json({ resposta: video });
    } catch (err) {
        next(err);
    }
}

exports.videos = async (req, res, next) => {
    //const { id } = req.params;
    try {
        const { QueryTypes } = require('sequelize');

        let body = req.body;
        let variavel = body.filter ? body.filter : [];
        let limit = body.limit || 10;
        let page = body.page || 0;

        const filtros = filtrosUtil.opcionais(variavel);

        const query = 'select video.id, video.celebridade, a.nome anunciante, m.nome marca, b.duracao, ' +
            'b.primeira_veic, sum(qtd_veiculacoes) qtd_veiculacoes ' +
            'from veiculacoes_video veic ' +
            'inner join ' + env.spot_reconhecimento + '.video video on video.id = veic.video_id ' +
            'inner join ' + env.spot_reconhecimento + '.bloco_rec b on b.id = veic.video_id ' +
            'inner join ' + env.spot_reconhecimento + '.marca_item mi on mi.id = b.marca_item_id ' +
            'inner join ' + env.spot_reconhecimento + '.marca m on m.id = mi.marca_id ' +
            'left join ' + env.spot_reconhecimento + '.anunciante a on a.id = mi.anunciante_id ' +
            'where (veic.data between :initDate and :endDate) and veic.praca = :praca ' +
            filtros.sql + filtros.sql_h_m + filtros.sql_b_n +
            ' group by 1 ' +
            'order by b.primeira_veic desc ' +
            `limit ${page}, ${limit}`
        let video = await db.sequelize.query(query, { replacements: { initDate: body.initDate, endDate: body.endDate, praca:body.praca }, type: QueryTypes.SELECT });

        res.status(200).json({ resposta: video });
    }
    catch (err) {
        next(err);
    }
}