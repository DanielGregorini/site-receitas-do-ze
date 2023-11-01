const express = require('express');
const router = express.Router();
const UsuarioRepository = require('../repository/usuario');

router.post('/', (req, res) => {

    //verificar o cabeçalho do token
    const { username, password } = req.body

    const dbResult = PessoaRepository.getByEmailandPassoword(username, password);
    
    if (dbResult.length === 0) {
        return res.status(401).json({ error: "Credencial inválida" });
    }

    const token = "xxxxx" //gerar
    //const { auterizarion } = req.headers;

})

modulo.exports = router;