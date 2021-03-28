const db = require('../config/db.config.js');
const env = require('../config/env.js');
var request = require('request');
const fs=require('fs');
var axios = require('axios');
const nodemailer = require('nodemailer');


exports.teste = async (req, res, next) => {
    //const { id } = req.params;
    try {
        
        const { QueryTypes } = require('sequelize');

        const teste = await db.sequelize.query(`SELECT * FROM users`, { type: QueryTypes.SELECT });
       
    
        res.status(200).json({resposta: teste});

        
}
catch (err) {
    next(err);
}

}


exports.whats = async (req, res, next) => {
    //const { id } = req.params;
    try {
        
        
       // let counter = 0;

//let timer = setInterval(function() {
 //   console.log('I am an asynchronous message');

  //  counter += 1;

  //  if (counter >= 10) {
  //      clearInterval(timer);
  //  }
//}, 3000);
        
        
        
        
        const { QueryTypes } = require('sequelize');

        const teste = await db.sequelize.query(`SELECT * FROM a`, { type: QueryTypes.SELECT });
        const tamanho = await db.sequelize.query(`SELECT COUNT(nome) as fura, telefone FROM a`, { type: QueryTypes.SELECT });
        console.log(teste);
        console.log(tamanho[0]['fura']);
        for(i=0;i<=295; i++){
            //res.send(teste[i]['nome']); 
            console.log(teste[i]['telefone']);
            let tel = 55 + teste[i]['telefone'];
            var data = JSON.stringify({"phone":tel,"body":"Boa noite meus amigos, Sou Fabrício Fiscal do Janones, https://m.facebook.com/story.php?story_fbid=3368785533248588&id=100003515238057&sfnsn=wiwspwa, PESSOAL acompanhe também está matéria no meu perfil PESSOAL Tmj"});

var config = {
  method: 'post',
  url: 'https://eu124.chat-api.com/instance200300/sendMessage?token=cr0ivzp4jq4yg0t1',
  headers: { 
    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjA0NjE1MDEwLCJleHAiOjE2MDQ3MDE0MTB9.1YN1xHqIg2X9768t_bfDSU68jXPs6s6ZitinVF7C9R4"', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
        }
    
      res.send(teste[0]['nome']); 

        
}
catch (err) {
    next(err);
}




}

exports.add = async (req, res, next) => {
    try {
        const { QueryTypes } = require('sequelize');
        let numero = req.body.numero;
        let nome = req.body.nome;

        let teste = await db.sequelize.query(`SELECT * FROM a WHERE telefone = ${numero}`, { type: QueryTypes.SELECT });

        if(teste.length != 0){
            teste = 1;
            res.status(200).json({"Error": "Ok"});
        }else{
            let teste = await db.sequelize.query(`INSERT INTO a (nome, telefone)
            VALUES ('${nome}', '${numero}')`, { type: QueryTypes.INSERT });
            res.status(200).json({resposta: teste});
        }

    }
    catch (err) {
        next(err);
    }
    
}

exports.denuncia = async (req, res, next) => {
    try {

        const { QueryTypes } = require('sequelize');

        let telefone = req.body.telefone;  
        let denuncia = req.body.denuncia;
        let status = req.body.status;

        let add = await db.sequelize.query(`INSERT INTO denuncia (telefone, denuncia,status)
        VALUES ('${telefone}', '${denuncia}','${status}')`, { type: QueryTypes.INSERT });
      
        let teste = await db.sequelize.query(`SELECT id FROM denuncia WHERE telefone = ${telefone} ORDER BY id DESC limit 1`, { type: QueryTypes.SELECT });

        res.status(200).json({resposta: teste});
        
    }
    catch (err) {
        next(err);
    }
    
}

exports.arquivo = async (req, res, next) => {
    try {
        const { QueryTypes } = require('sequelize');
        let id = req.params.id;
        let arquivo = req.body.images;

        for(const {imag} of arquivo){
            const filename = `${Date.now()}.pdf`;
            const zz = 'users-arquivo/'+filename;
            fs.writeFile('users-arquivo/'+filename, imag, 'base64', console.log)
            const b = await db.sequelize.query(`INSERT INTO arquivo (id_denuncia, arquivo)
            VALUES ('${id}', '${zz}')`, { type: QueryTypes.INSERT });
           
            res.status(200).json({resposta: 'sucesso'});
          }

    }
    catch (err) {
        next(err);
    }
    
}

exports.imagem = async ( req, res, next) => {
    try {
        const { QueryTypes } = require('sequelize');
        let id = req.params.id;
        let imagem = req.body.images;

        for(const {image} of imagem){
            const filename = `${Date.now()}.png`;
            const zz = 'users-images/'+filename;
            fs.writeFile('users-images/'+filename, image, 'base64', console.log)
            const b = await db.sequelize.query(`INSERT INTO imagem (id_denuncia, imagem)
            VALUES ('${id}', '${zz}')`, { type: QueryTypes.INSERT });
           
            res.status(200).json({resposta: 'sucesso'});
          }

    }
    catch (err) {
        next(err);
    }
    
}

exports.ip = async (req, res, next) => {
    try {
       const { QueryTypes } = require('sequelize');
       let id = req.params.id;
       let ip = req.body.ip;
       let latitude = req.body.latitude;
       let longitude = req.body.longitude;
       let valor = req.body.valor;

       const b = await db.sequelize.query(`INSERT INTO verify (id_denuncia, ip, latitude, longitude, valor)
       VALUES ('${id}', '${ip}', '${latitude}', '${longitude}', '${valor}')`, { type: QueryTypes.INSERT });
      
       res.status(200).json({resposta: 'sucesso'});

        

    }
    catch (err) {
        next(err);
    }
    
}

exports.email = async (req, res, next) => {

  let nome = req.body.nome;
  let email = req.body.email;
  let telefone = req.body.telefone;
  let texto = req.body.texto;

  if(email == null){
    email='Não tem';
  }
  if(telefone == null){
    telefone='não tem';
  }


  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'fernandofitilan@gmail.com',
      pass: '!Lambari1'
    }
  });
  
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'fernandofitilan@hotmail.com',
    subject: 'Cliente do site Brazil Valle',
    text: `nome: ${nome}, email: ${email}, telefone: ${telefone}, texto: ${texto}`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(400).json(error);
    } else {
      res.status(200).json('Email sent: ' + info.response);
    }
  });

}


exports.ip = async (req, res, next) => {
  try {

      const { QueryTypes } = require('sequelize');
      const ip =req.params.ip;
      

      //let add = await db.sequelize.query(`INSERT INTO denuncia (telefone, denuncia,status)
      //VALUES ('${telefone}', '${denuncia}','${status}')`, { type: QueryTypes.INSERT });
    
      let teste = await db.sequelize.query(`SELECT * FROM users WHERE ip = ${ip}`, { type: QueryTypes.SELECT });

      res.status(200).json({resposta: teste});
      
  }
  catch (err) {
      next(err);
  }
  
}


exports.get = async (req, res, next) => {
  try {

     
      res.status(200).json({resposta: 'ola'});
      
  }
  catch (err) {
      next(err);
  }
  
}