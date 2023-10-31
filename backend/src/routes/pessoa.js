const express = require('express');
const router = express.Router();
const PessoaRepository = require('../repository/pessoa');

// Obter todas as pessoas
router.get("/", async (req, res) => {
    const pessoas = await PessoaRepository.getAll();
    return res.json(pessoas);
});

// Obter por ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const pessoa = await PessoaRepository.getById(id);

    if (pessoa.length === 0) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    return res.json(pessoa[0]);
});

// Criar pessoa
router.post("/", async(req, res) => {
    // Executa a inserção na tabela de pessoa no DB
    const dbResult = await PessoaRepository.create(req.body);
  
  
    // Verificando se alguma pessoa foi "afetada" na tabela
    if(dbResult.affectedRows == 0) {
      // Envia uma mensagem de código 400 (Bad Request)
      return res.status(400).json({ message: "Falha ao inserir pessoa"});
    }
  

    req.body.id = dbResult.insertId;
    return res.json(req.body);
  })
  

// Atualizar pessoa
router.put("/:id", async (req, res) => {
    
    const { id } = req.params;
    const pessoa = req.body;

    const pessoaDB = await PessoaRepository.getById(id);

    if (pessoaDB.length === 0) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    const dbResult = await PessoaRepository.update(id, pessoa);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao atualizar pessoa" });
    }

    return res.json({ data: pessoa });
});

// Deletar pessoa
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const pessoaDB = await PessoaRepository.getById(id);

    if (pessoaDB.length === 0) {
        return res.status(404).json({ error: "Pessoa não encontrada" });
    }

    const dbResult = await PessoaRepository.remove(id);

    if (dbResult.affectedRows === 0) {
        return res.status(400).json({ error: "Falha ao deletar pessoa" });
    }

    return res.json({ message: "Pessoa deletada" });
});

module.exports = router;
