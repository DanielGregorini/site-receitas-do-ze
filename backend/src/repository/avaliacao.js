const connection = require('../connection');
const TABLE = 'tb_avaliacao';

//consultar as receitas no banco de dados tabela receitas
const getAll = async () => {

    const [query] = await connection.execute(
        `SELECT id, receita_id, usuario_id, classificacao, comentario, data_avaliacao FROM ${TABLE}`
    );

    return query;
}

//obter uma avaliacao pelo id
const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, receita_id, usuario_id, Classificacao, comentario, data_avaliacao FROM ${TABLE} WHERE id = ${id}`
    );
    return query;
}

//insert uma avaliacao
const create = async (avaliacao) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (receita_id, usuario_id, classificacao, comentario, data_avaliacao) VALUES (
        "${avaliacao.receita_id}", 
        "${avaliacao.usuario_id}", 
        "${avaliacao.classificacao}", 
        "${avaliacao.comentario}",  
        "${avaliacao.data_avaliacao}")`
    );
    return query;
}

//atualizar uma avaliacao pelo id
const update = async (id, avaliacao) => {

    const [query] = await connection.execute(
        `UPDATE ${TABLE} SET
        receita_id = ${avaliacao.receita_id}, 
        usuario_id = ${avaliacao.usuario_id}, 
        classificacao = "${avaliacao.classificacao}", 
        comentario = "${avaliacao.comentario}"
        WHERE id = ${id}`
    );

    return query;
}


//deletar uma avaliacao do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}

module.exports = { getAll, create, getById, update, remove }