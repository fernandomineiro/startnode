function opcionais(variavel) {
    let sql = '';
    let sql_h_m = '';
    let sql_b_n = '';

    if(variavel.length) {
      let branco = negro = masculino = feminino = 0;
      let masculino_feminino = branco_negro = false;
      let sqlTags = '';

      for (var i = 0; i < variavel.length; i++) {
        if (variavel[i]['value'] == '/celebridades') {
          sql += ` and video.celebridade = '${variavel[i]['display']}'`
        } else if (variavel[i]['value'] == '/anunciantes') {
          sql += ` and a.nome = '${variavel[i]['display']}'`
        } else if (variavel[i]['value'] == '/marcas') {
          sql += ` and m.nome = '${variavel[i]['display']}'`
        } else if (variavel[i]['value'] == 'Bebê') {
          sql += ' and video.ciclo_vida_bebe = 1 '
        } else if (variavel[i]['value'] == 'Criança') {
          sql += ' and video.ciclo_vida_crianca = 1 '
        } else if (variavel[i]['value'] == 'Adulto') {
          sql += ' and video.ciclo_vida_adulto = 1 '
        } else if (variavel[i]['value'] == 'Adolescentes') {
          sql += ' and video.ciclo_vida_adolescente = 1 '
        } else if (variavel[i]['value'] == 'Idoso') {
          sql += ' and video.ciclo_vida_idoso = 1 '
        } else if (variavel[i]['value'] == 'Famílias') {
          sql += ' and video.familia = 1 '
        } else if (variavel[i]['value'] == 'Animais') {
          sql += ' and video.animais = 1 '
        } else if (variavel[i]['value'] == 'Com pessoas') {
          sql += ' and video.pessoa = 1 '
        } else if (variavel[i]['value'] == 'Sem pessoas') {
          sql += ' and video.pessoa = 0 '
        } else if (variavel[i]['value'] == 'Anunciantes') {
          sql += ` and a.nome LIKE '%${variavel[i]['display']}%' `
        } else if (variavel[i]['value'] == 'Celebridades') {
          sql += ` and video.celebridade LIKE '%${variavel[i]['display']}%' `
        } else if (variavel[i]['value'] == 'Marcas') {
          sql += ` and m.nome LIKE '%${variavel[i]['display']}%' `
        } else if (variavel[i]['value'] == 'Vídeos') {
          sql += ` and (m.nome LIKE '%${variavel[i]['display']}%' OR video.celebridade LIKE '%${variavel[i]['display']}%' OR a.nome LIKE '%${variavel[i]['display']}%') `
        } else if (variavel[i]['value'] == 'Tag') {
          if(sqlTags === '') {
            sqlTags += ` video.palavras_chave LIKE '%${variavel[i]['display']}%' `
          } else {
            sqlTags += ` or video.palavras_chave LIKE '%${variavel[i]['display']}%' `
          }

        } else if (variavel[i]['value'] == 'Branco') {
          branco = 1;
        } else if (variavel[i]['value'] == 'Negro') {
          negro = 1;
        } else if (variavel[i]['value'] == 'Mulher') {
          feminino = 1;
        } else if (variavel[i]['value'] == 'Homem') {
          masculino = 1;
        } else if (variavel[i]['value'] == 'Homem e Mulher') {
          masculino_feminino = true;
        } else if (variavel[i]['value'] == 'Branco e Negro') {
          branco_negro = true;
        }
      }

      if(sqlTags != '') {
        sql += ` and (${sqlTags})`;
      }

      // Filtros multiplos
      if ( masculino === 1 && feminino === 1 && !masculino_feminino ) {
        sql_h_m += ` and (video.sexo_m = 1 or video.sexo_f = 1) `;
      } else if ( (masculino === 1 || feminino === 1) && !masculino_feminino) {
        sql_h_m += ` and (video.sexo_m = ${masculino} and video.sexo_f = ${feminino}) `;
      } else if ( (masculino === 1 || feminino === 1) && masculino_feminino) {
        sql_h_m += ` and ( (video.sexo_m = ${masculino} and video.sexo_f = ${feminino}) or (video.sexo_m = 1 and video.sexo_f = 1) )`;
      } else if ( (masculino === 0 && feminino === 0) && masculino_feminino) {
        sql_h_m += ` and (video.sexo_m = 1 and video.sexo_f = 1) `;
      }

      if ( branco === 1 && negro === 1 && !branco_negro ) {
        sql_b_n += ` and (video.cor_pele_branco = 1 or video.cor_pele_negro) `;
      } else if ( (branco === 1 || negro === 1) && !branco_negro) {
        sql_b_n += ` and (video.cor_pele_branco = ${branco} and video.cor_pele_negro = ${negro}) `;
      } else if ( (branco === 1 || negro === 1) && branco_negro) {
        sql_b_n += ` and ( (video.cor_pele_branco = ${branco} and video.cor_pele_negro = ${negro}) or (video.cor_pele_branco = 1 and video.cor_pele_negro = 1) ) `;
      } else if ( (branco === 0 && negro === 0) && branco_negro) {
        sql_b_n += ` and (video.cor_pele_branco = 1 and video.cor_pele_negro = 1) `;
      }

    }

    return {
        sql,
        sql_h_m,
        sql_b_n
    }
}

async function getConfig(user_id) {
  const configs = await db.sequelize.query(`SELECT * FROM user_configs WHERE user_id = :user_id`, { replacements: { user_id }, type: QueryTypes.SELECT });

  if(configs.length) {
    return configs[0];
  }

  return null;
}

module.exports = {
    opcionais
}
  