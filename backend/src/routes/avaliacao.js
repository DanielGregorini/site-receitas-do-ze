const express = require('express');
const router = express.Router();
const AvaliacaoRepository = require('../repository/avaliacao');
const isAuthorized = require('../middleware/isAuthorized');

// Obter todas as avaliacoes
router.get("/", async (req, res) => {
    const avaliacoes = await AvaliacaoRepository.getAll();
    return res.json(avaliacoes);
});

// Obter por ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const avaliacao = await AvaliacaoRepository.getById(id);

    if (avaliacao.length === 0) {
        return res.status(404).json({ error: "Avaliação não encontrado" });
    }

    return res.json(avaliacao[0]);
});

// Criar avaliaca
router.post("/", isAuthorized, async(req, res) => {
    // Executa a inserção na tabela de pessoa no DB
    //console.log(req.body)
    const dbResult = await AvaliacaoRepository.create(req.body);
  
    // Verificando se alguma Usuario foi "afetada" na tabela
    if(dbResult.affectedRows == 0) {
      // Envia uma mensagem de código 400 (Bad Request)
      return res.status(400).json({ message: "Falha ao inserir avaliacao"});
    }
  
    req.body.id = dbResult.insertId;
    return res.json(req.body);
  })
  
// Atualizar avaliacao
router.put("/:id", isAuthorized, async (req, res) => {
    
    const { id } = req.params;
    const avaliacao = req.body;
    const avaliacaoDB = await AvaliacaoRepository.getById(id);

    if (avaliacaoDB.length === 0) {
        return res.status(404).json({ error: "Avaliacao não encontrada" });
    }
    
    const dbResult = await AvaliacaoRepository.update(id, avaliacao);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar avaliação" });
    }

    return res.json({ data: avaliacao});
});

// Deletar avalicao
router.delete("/:id", isAuthorized, async (req, res) => {
    const { id } = req.params;
    console.log("Deletando avalição: ",id)
    const avaliacaoDB = await AvaliacaoRepository.getById(id);

    if (avaliacaoDB.length === 0) {
        return res.status(404).json({ error: "avaliação não encontrada" });
    }

    const dbResult = await AvaliacaoRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar avaliação" });
    }

    return res.json({ message: "avaliacao deletada" });
});

module.exports = router;
