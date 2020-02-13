const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars'); // preencher variaveis em arquivos html

const { host, port, user, pass } = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

transport.use('compile', hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html', // nome da extensão
}));

module.exports = transport;