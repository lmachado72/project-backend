const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({ // campos dentro do banco de dados
    name: {
        type: String, // tipo string
        require: true, // obrigatório
    },
    email: {
        type: String,
        unique: true, // unica
        required: true, // obrigatória
        lowercase: true, // caixa baixa
    },
    password: {
        type: String,
        required: true, // obrigatória
        select: false, // quando buscar usuario/os a senha n venha
    },
    passwordResetToken: {
        type: String,
        select: false,
    },
    passwordResetExpires: {
        type: Date,
        select: false,
    },
    createdAt: { // anotar data que registro foi criado
        type: Date,
        default: Date.now,
    },
});

UserSchema.pre('save', async function(next) { // pre = acontecer alguma coisa antes de salvar
    const hash = await bcrypt.hash(this.password, 10); // this = se refere ao objeto q esta sendo salvado
    this.password = hash;

    next();
});

const User = mongoose.model ('User', UserSchema);

module.exports = User;

// model de usuario definido
// src/index.js & src/database/index.js criado
// definir rotas pra poder se registrar e se autenticar