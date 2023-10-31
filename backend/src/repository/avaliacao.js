const connection = require('../connection');
const TABLE = 'tb_avaliacao';

//consultar as receitas no banco de dados tabela receitas
const getAllAvaliacao = async () => {

    const [query] = await connection.execute(
        `SELECT id, ID_da_receita, ID_do_avaliador, Classificacao, Comentario, Data_de_avaliacao, FROM ${TABLE}`
    );

    return query;
}

//obter uma receita pelo id
const getByIdAvaliacao = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, ID_da_receita, ID_do_avaliador, Classificacao, Comentario, Data_de_avaliacao, FROM ${TABLE} WHERE id = ${id} LIMIT 1`
    );
    return query;
}

//insert
const createAvaliacao = async (avaliacao) => {

    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (id, titulo, descricao, ingredientes, intrucoes, id_do_autor, data_de_criacao) VALUES (
        "${avaliacao.id}", 
        "${avaliacao.id_da_receita}", 
        "${avaliacao.id_do_avaliador}", 
        "${avaliacao.classificacao}", 
        "${avaliacao.cata_de_avaliacao}")`
    );
    return query;
}

//atualizar
const updateAvaliacao = async (id, avaliacao) => {

    const [query] = await connection.execute(
        `UPDATE ${TABLE} set
        "${avaliacao.id}", 
        "${avaliacao.id_da_receita}", 
        "${avaliacao.id_do_avaliador}", 
        "${avaliacao.classificacao}", 
        "${avaliacao.cata_de_avaliacao}")
        "WHERE id = ${id}"`
    );
    
    return query;
}

//deletar umas receita do banco de dados
const removeAvaliacao = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAllAvaliacao, createAvaliacao, getByIdAvaliacao, updateAvaliacao, removeAvaliacao}