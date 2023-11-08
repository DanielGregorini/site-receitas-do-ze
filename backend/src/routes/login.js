const express = require('express');
const router = express.Router();
const UsuarioRepository = require('../repository/usuario');
const jwt = require("jsonwebtoken");
const env = require('../env')

/*

*@param {*} params objeto contento os parâmetros para codificar no token

@param {*} timeout tempo de exiração do token em segundo
*
*
*d

*/

const generateToken = (params = {}, timeout = 86400) => {
    return jwt.sign(params, env.SECRETKEY, {expiresIn: timeout});
};

router.post('/', async (req, res) => {

    //verificar o cabeçalho do token
    //obter o usuario e seha enviados por JSON(body)
    const { username, password } = req.body

    console.log(req.body);
    const dbResult = await UsuarioRepository.getByEmailAndPassoword(username, password);
    
    
    if (dbResult.length === 0) {
        return res.status(401).json({ error: "Credencial inválida" });
    }

    const token = generateToken({
        id: dbResult[0].id,
        nome: dbResult[0].nome,
        email: username

    }, 3600); //gerar
    
    const now = new Date();
    dbResult[0].senha = undefined;

    return res.json({
        token,
        user: dbResult[0],
        loggedId:  now,
        expiresIn: new Date(now.getTime() + 3600 * 1000)
    });

});

module.exports = router;