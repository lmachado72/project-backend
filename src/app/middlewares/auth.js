const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json'); // importar secret

module.exports = (req, res, next) => { // next = somente se o usuario estiver pronto pro proximo passo
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'No token provided'});

    const parts = authHeader.split(' '); // Bearer v348v39qvjjfq3v934934q3
// separar em duas partes
    if (!parts.length === 2) // verificar se existem duas partes
        return res.status(401).send({ error: 'Token error' });
    
    const [ scheme, token ] = parts;

    if (!/^Bearer$/i.test(scheme)) // / = começar rejecs, ^ = inicio da verificação, Bearer = palavara pra buscar, $ = indicar final da verificação
        return res.status(401).send({ error: 'Token malformatted'});

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });
    
        req.userId = decoded.id;
        return next();
    });
    
    };  