const fs = require('fs');
const path = require('path');

module.exports = app => {
    fs
        .readdirSync(__dirname) // ler diretorio
        .filter(file => ((file.indexOf('.')) !== 0 && (file!== "index.js"))) // filtrar arquivos
        .forEach(file => require(path.resolve(__dirname, file))(app));
};