// conexão com o banco de dados
const mongoose = require('mongoose'); // se conecta ao mongoDB

mongoose.connect('mongodb://localhost/noderest', { useMongoClient: true }); // conectar ao banco de dados
mongoose.Promise = global.Promise; // padrão pra todo projeto

module.exports = mongoose;
