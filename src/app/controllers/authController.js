const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const authConfig = require('../../config/auth');

const User = require('../models/User'); // fazer ações de login e cadastro

const router = express.Router(); // poder definir rotas só pra usuario

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400, // quando token expira = 1 dia
    });
}

router.post('/register', async(req, res) => { // rota de cadastro
    const { email } = req.body; // pegar email dos parametros

    try { // criar novo usuario quando chamar essa rota
        if (await User.findOne({ email })) // se email ja existir retornar q email ja existe
            return res.status(400).send({ error: 'User already exists'});

        const user = await User.create(req.body); // await = esperar ser executado pra continuar / todos parametros que o usuario ta criando e repassar pra esse User.create()

        user.password = undefined; // senha apagada da visão assim que usuario for criado

        return res.send({
            user,
            token: generateToken({ id: user.id }),
        });
    } catch (err) { // ficar sabendo sempre que for acontecer uma falha no registro
        return res.status(400).send({ error: 'Registration Failed' });
    }
});

// criado controller de autenticação
// porém não referenciado ainda dentro da aplicação
// referenciar authController dentro do /src/index.js

router.post('/authenticate', async(req,res) => { // rota de autenticação
    const { email, password } = req.body;

    const user = await User.findOne ({ email }).select('+password'); // ver se existe usuario no banco de dados

    if (!user) // se usuario n existe
        return res.status(400).send({ error: 'User not found' });

    if (!await bcrypt.compare(password, user.password)) // se senhas n batem
        return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;    

    res.send({
        user,
        token: generateToken({ id: user.id }),
    });
});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }); // procurar usuario com esse email

        if (!user)
            return res.status(400).send({ error: 'User not found' });
    
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);
            
        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });

      mailer.sendMail({
          to: email,
          from: 'luvvasm@gmail.com',
          template: 'auth/forgot_password',
          context: { token },
      }, (err) => {
        if (err)
            return res.status(400).send({ error: 'Cannot send forgot password email'});
      
        return res.send();    
        })
    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Error on forgot password, try again'});
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne ({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user)
            return res.status(400).send({ error: 'User not found' });        
            
        if (token !== user.passwordResetToken) // verificar se os token são iguais
            return res.status(400).send({ error: 'Token invalid' }); 
        
       const now = new Date(); // pegar data de agr

        if (now > user.passwordResetExpires)
            return res.status(400).send({ error: 'Token expired, please generate a new one'});

        user.password = password;

        await user.save();

        res.send();

    } catch (err) {
        res.status(400).send({ error: 'Cannot reset password, try again'});
    }
});

module.exports = app => app.use('/auth', router); 