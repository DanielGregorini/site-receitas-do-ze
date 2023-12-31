const express = require('express');
const router = express.Router();
const ReceitaRepository = require('../repository/receita');
const isAuthorized = require('../middleware/isAuthorized');

// Obter todas as receitas
router.get("/", async (req, res) => {
    
    const receitas = await ReceitaRepository.getAll();
    return res.json(receitas);
    
});

// Obter por ID um receita
router.get("/:id", async (req, res) => {
   
    const id = req.params.id;
    const usuario = await ReceitaRepository.getById(id);
    
    if (usuario.length === 0) {
        return res.status(404).json({ error: "Receita não encontrado" });
    }

    return res.json(usuario[0]);
});

// Criar receita
router.post("/", isAuthorized, async (req, res) => {
    console.log(req.body);
    // Verificar se os dados da receita estão presentes no corpo da requisição
    const { titulo, descricao, ingredientes, instrucoes, id_usuario, criacao } = req.body;

    if (!titulo || !descricao || !ingredientes || !instrucoes || !id_usuario || !criacao) {
        // Se algum dado estiver ausente, retornar um erro 401 (Unauthorized)
        return res.status(400).json({ message: "Dados da receita incompletos ou inválidos." });
    }

    // Executa a inserção na tabela de receita no DB
    const dbResult = await ReceitaRepository.create(req.body);

    console.log("Nova receita:");
    console.log(req.body);

    // Verificando se alguma Receita foi "afetada" na tabela
    if (dbResult.affectedRows == 0) {
        // Envia uma mensagem de código 400 (Bad Request)
        return res.status(400).json({ message: "Falha ao inserir receita." });
    }

    req.body.id = dbResult.insertId;
    return res.json(req.body);
});


// Atualizar receita
router.put("/:id", isAuthorized, async (req, res) => {

    console.log(req.body);

    const { id } = req.params;
    const receita = req.body;

    const receitaDB = await ReceitaRepository.getById(id);

    if (receitaDB.length === 0) {
        return res.status(404).json({ error: "receita não encontrada" });
    }

    const dbResult = await ReceitaRepository.update(id, receita);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar receita" });
    }

    receita.criacao = receitaDB[0].criacao;
    return res.json({ id, ...receita });

});

// Deletar receita
router.delete("/:id", isAuthorized, async (req, res) => {
    
    console.log(req.body);
    const { id } = req.params;
    const receitaDB = await ReceitaRepository.getById(id);

    if (receitaDB.length === 0) {
        return res.status(404).json({ error: "Receita não encontrada" });
    }

    const dbResult = await ReceitaRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar receita" });
    }

    return res.json({ message: "receita deletado" });
});

module.exports = router;