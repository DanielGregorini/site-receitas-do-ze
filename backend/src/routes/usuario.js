const express = require('express');
const router = express.Router();
const UsuarioRepository = require('../repository/usuario');

// Obter todas as usuarios
router.get("/", async (req, res) => {
    const usuarios = await UsuarioRepository.getAllUsuario();
    return res.json(usuarios);
});

// Obter por ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const usuario = await UsuarioRepository.getByIdUsuario(id);

    if (usuario.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrado" });
    }

    return res.json(usuario[0]);
});

// Criar pessoa
router.post("/", async (req, res) => {
    // Executa a inserção na tabela de pessoa no DB
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
router.put("/:id", async (req, res) => {

    const { id } = req.params;
    const usuario = req.body;
    const usuarioDB = await UsuarioRepository.getByIdUsuario(id);

    if (usuarioDB.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrada" });
    }

    const dbResult = await UsuarioRepository.updateUsuario(id, usuario);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar usuario" });
    }
    
    //usuario.id = id;
    return res.json({id, ...usuario});
});

// Deletar pessoa
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const usuarioDB = await UsuarioRepository.getByIdUsuario(id);

    if (usuarioDB.length === 0) {
        return res.status(404).json({ error: "usuario não encontrada" });
    }

    const dbResult = await UsuarioRepository.removeUsuario(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar usuario" });
    }

    return res.json({ message: "usuario deletado" });
});

module.exports = router;
