const express = require('express'); // mexer com rotas = necessário express
const bodyParser = require('body-parser');

const app = express(); // criar aplicação

app.use(bodyParser.json()); // entender ao enviar requisição a API com informações em JSON
app.use(bodyParser.urlencoded({ extended: false })); // entender quando passar parametros em URL

// app.get('/', (req, res) => { // req = dados de requisição (parametros, touken)
//    res.send('OK'); // res = enviar resposta pro usuário quando acessar essa rota
// })

require('./app/controllers/index')(app); // app = objeto definido 1x e precisa utilizar mesma classe em todos os outros arquivos  

app.listen(3001);