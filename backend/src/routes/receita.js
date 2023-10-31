const express = require('express');
const router = express.Router();
const ReceitaRepository = require('../repository/receita');

// Obter todas as receitas
router.get("/receita/", async (req, res) => {
    const receitas = await ReceitaRepository.getAllReceita();
    return res.json(receitas);
});

// Obter por ID
router.get("/receita/:id", async (req, res) => {

    const id = req.params.id;
    const usuario = await ReceitaRepository.getByIdReceita(id);

    if (usuario.length === 0) {
        return res.status(404).json({ error: "Receita não encontrado" });
    }

    return res.json(usuario[0]);
});

// Criar receita
router.post("/receita/", async(req, res) => {
    // Executa a inserção na tabela de pessoa no DB
    const dbResult = await ReceitaRepository.create(req.body);
  
  
    // Verificando se alguma Receita foi "afetada" na tabela
    if(dbResult.affectedRows == 0) {
      // Envia uma mensagem de código 400 (Bad Request)
      return res.status(400).json({ message: "Falha ao inserir receita"});
    }
  
    req.body.id = dbResult.insertId;
    return res.json(req.body);
  })
  

// Atualizar receita
router.put("/receita/:id", async (req, res) => {
    
    const { id } = req.params;
    const receita = req.body;

    const receitaDB = await UsuarioRepository.getByIdUsuario(id);

    if (receitaDB.length === 0) {
        return res.status(404).json({ error: "Usuario não encontrada" });
    }

    const dbResult = await UsuarioRepository.updateUsuario(id, usuario);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar usuario" });
    }

    return res.json({ data: receita});

});

// Deletar receita
router.delete("/receita/:id", async (req, res) => {

    const { id } = req.params;
    const receitaDB = await ReceitaRepository.getByIdReceita(id);

    if (receitaDB.length === 0) {
        return res.status(404).json({ error: "Receita não encontrada" });
    }

    const dbResult = await ReceitaRepository.removeReceita(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar receita" });
    }

    return res.json({ message: "receita deletado" });
});

module.exports = router;