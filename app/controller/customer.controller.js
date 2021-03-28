const db = require('../config/db.config.js');
const Op = db.Sequelize.Op;
const User = db.user;
const ResetToken  = db.resettoken;
var Sequelize = require("sequelize");
var ls = require('local-storage');
let crypto = require('crypto');
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');

const env = require('../config/env.js');

var transporter = nodemailer.createTransport({
  host: 'smtp.googlemail.com', // Gmail Host
  port: 465, // Port
  secure: true, // this is true as port is 465
  auth: {
      user: 'fernandofitilan@gmail.com', // generated ethereal user
      pass: '', // generated ethereal password
  },
});




//const User = db.user;



exports.teste =  async (req, res, next) => {
  //const { id } = req.params;
  try{
      const { QueryTypes } = require('sequelize');
      const users = await db.sequelize.query("SELECT * FROM `users`", { type: QueryTypes.SELECT });
        res.status(200).json({ auth:  users});
      }
      catch (err) {
        next(err);
      }  
}
exports.forgotpasswordd =  async (req, res, next) => {
  try{
    res.render("forgot-password");
  }  
  catch (err) { 
    next(err);
  }  
}
 
exports.forgotpassword =  async (req, res, next) => {
  //const { id } = req.params;
  try{
    
    var email = await User.findOne({where: { email: req.body.email }});
    if (email == null) {
    /**
     * we don't want to tell attackers that an
     * email doesn't exist, because that will let
     * them use this form to find ones that do
     * exist.
     **/
      return res.json({status: 'não encontrado'});
    }
    /**
     * Expire any tokens that were previously
     * set for this user. That prevents old tokens
     * from being used.
     **/
    await ResetToken.update({
        used: 1
      },
      {
        where: {
          email: req.body.email
        }
    });
   
    //Create a random reset token
    var fpSalt = crypto.randomBytes(64).toString('base64');
   
    //token expires after one hour
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1/24);
   
    //insert token data into DB
    await ResetToken.create({
      email: req.body.email,
      expiration: expireDate,
      token: fpSalt,
      used: 0
    });
    var emailtoken = encodeURIComponent(fpSalt);

    var mailOptions = {
      from: 'suporte do sistema',
      to: req.body.email,
      subject: 'Tutorial para resetar sua senha!',
      text: 'Parar resetar seu email copie esse link... http://localhost:4200/resete/'+emailtoken+'/'+req.body.email
    };
   
    //create email
    const message = {
        from: 'Suporte Tecnico',
        to: req.body.email,
        replyTo: 'teste oi',
        subject: 'teste',
        text: 'Parar resetar seu email copie esse link... .\n\nhttps://localhost:4002/reset-password/'+encodeURIComponent(fpSalt)+'/'+req.body.email
    };
   
    //send email
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
   
    return res.json({status: 'ok', token : fpSalt});
  
}
catch (err) {
  next(err);
}  
}

exports.getresetpassword =  async (req, res, next) => {
try{
  await ResetToken.destroy({
    where: {
      expiration: { [Op.lt]: Sequelize.fn('CURDATE')},
    }
  });
 
  //find the token
  var record = await ResetToken.findOne({
    where: {
      email: req.body.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
      token: req.body.token,
      used: 0
    }
  });
 
  if (record == null) {
    
  
  return res.json({status: 'error', message: 'Token expirado.'});
   
  }

 
  return res.json({status: 'ok', message: 'tudo ok'});
}
catch (err) {
  next(err);
}  
}

exports.resetpassword =  async (req, res, next) => {
try{
  if (req.body.password1 !== req.body.password2) {
    return res.json({status: 'error', message: 'Passwords diferentes, tente novamente.'});
  }
 
 
  var record = await ResetToken.findOne({
    where: {
      email: req.body.email,
      expiration: { [Op.gt]: Sequelize.fn('CURDATE')},
      token: req.body.token,
      used: 0
    }
  });
 
  if (record == null) {
    return res.json({status: 'error', message: 'Token não encontrad0. Por favor tente novamente.'});
  }
 
  var upd = await ResetToken.update({
      used: 1
    },
    {
      where: {
        email: req.body.email
      }
  });
 
  var newSalt = crypto.randomBytes(64).toString('hex');
  var newPassword = bcrypt.hashSync(req.body.password1, 8);
 
  await User.update({
    password: newPassword,
    salt: newSalt
  },
  {
    where: {
      email: req.body.email
    }
  });
 
  return res.json({status: 'ok', message: ' Sucesso, entre com a nova senha!.'});

  
}
catch (err) {
  next(err);
}  
}


 
