const connection = require('../connection');
const TABLE = 'tb_receita';

//consultar as receitas no banco de dados tabela receitas
const getAll = async () => {

    const [query] = await connection.execute(
        `SELECT id, titulo, descricao, ingredientes, instrucoes, id_usuario, criacao FROM ${TABLE}`
    );

    return query;
}

//obter uma receita pelo id
const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, titulo, descricao, ingredientes, instrucoes, id_usuario, criacao FROM ${TABLE} WHERE id = ${id} LIMIT 1`
    );
    return query;
}

//inserir uma receita
const create = async (receita) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (titulo, descricao, ingredientes, instrucoes, id_usuario, criacao) VALUES (
        "${receita.titulo}", 
        "${receita.descricao}", 
        "${receita.ingredientes}", 
        "${receita.instrucoes}", 
        "${receita.id_usuario}", 
        "${receita.criacao}")`
    );
    return query;
}

//atualizar uma receita pelo id
const update = async (id, receita) => {
    const [query] = await connection.execute(
        `UPDATE ${TABLE} set
        titulo = "${receita.titulo}", 
        descricao = "${receita.descricao}", 
        ingredientes ="${receita.ingredientes}", 
        instrucoes ="${receita.instrucoes}", 
        id_usuario = ${receita.id_usuario}
        WHERE id = ${id}`
    );
    
    return query;
}

//deletar uma receita
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAll, create, getById, update, remove}