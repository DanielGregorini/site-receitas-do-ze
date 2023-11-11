const express = require('express');
const router = express.Router();
const UsuarioRepository = require('../repository/usuario');
const isAuthorized = require('../middleware/isAuthorized');

// Obter todas as usuarios
router.get("/", isAuthorized, async (req, res) => {
    const usuarios = await UsuarioRepository.getAll();
    return res.json(usuarios);
});

// Obter por ID
router.get("/:id",isAuthorized, async (req, res) => {
    console.log(res.body);
    const id = req.params.id;
    const usuario = await UsuarioRepository.getById(id);

    if (usuario.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrado" });
    }

    console.log(usuario[0]);
    return res.json(usuario[0]);
});

// Criar usuario
router.post("/", async (req, res) => {
    // Executa a inserção na tabela de pessoa no DB
    console.log(req.body);
    try {
        const dbResult = await UsuarioRepository.create(req.body);

        // Verificando se alguma Usuario foi "afetada" na tabela
        if (dbResult.affectedRows == 0) {
            // Envia uma mensagem de código 400 (Bad Request)
            return res.status(400).json({ message: "Falha ao inserir usuario" });
        }

        req.body.id = dbResult.insertId;
        return res.json(req.body);
    } catch (err) {
        return res.status(400).json({ message: "Falha ao inserir usuario", detail: err });
    }


})

// Atualizar pessoa
router.put("/:id", isAuthorized, async (req, res) => {

    const { id } = req.params;
    const usuario = req.body;
    const usuarioDB = await UsuarioRepository.getById(id);

    if (usuarioDB.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrada" });
    }

    const dbResult = await UsuarioRepository.update(id, usuario);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar usuario" });
    }
    
    //usuario.id = id;
    return res.json({id, ...usuario});
});

// Deletar pessoa
router.delete("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    const usuarioDB = await UsuarioRepository.getById(id);

    if (usuarioDB.length === 0) {
        return res.status(404).json({ error: "usuario não encontrada" });
    }

    const dbResult = await UsuarioRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar usuario" });
    }

    return res.json({ message: "usuario deletado" });
});

module.exports = router;
