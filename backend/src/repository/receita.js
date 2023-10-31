const connection = require('../connection');
const TABLE = 'tb_receita';

//consultar as receitas no banco de dados tabela receitas
const getAllReceita = async () => {

    const [query] = await connection.execute(
        `SELECT id, titulo, descricao, ingredientes, intrucoes, id_do_autor, data_de_criacao FROM ${TABLE}`
    );

    return query;
}

//obter uma receita pelo id
const getByIdReceita = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, titulo, descricao, ingredientes, intrucoes, id_do_autor, data_de_criacao FROM ${TABLE} WHERE id = ${id} LIMIT 1`
    );
    return query;
}

//insert
const createReceita = async (receita) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (id, titulo, descricao, ingredientes, intrucoes, id_do_autor, data_de_criacao) VALUES (
        "${receita.id}", 
        "${receita.titulo}", 
        "${receita.descricao}", 
        "${receita.ingredentes}", 
        "${receita.id_do_autor}", 
        "${receita.data_de_criacao}")`
    );
    return query;
}

//atualizar
const updateReceita = async (id, receita) => {
    const [query] = await connection.execute(
        `UPDATE ${TABLE} set
        "${receita.id}", 
        "${receita.titulo}", 
        "${receita.descricao}", 
        "${receita.ingredentes}", 
        "${receita.id_do_autor}", 
        "${receita.data_de_criacao}", 
        "WHERE id = ${id}"`
    );
    
    return query;
}

//deletar umas receita do banco de dados
const removeReceita = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAllReceita, createReceita, getByIdReceita, updateReceita, removeReceita}