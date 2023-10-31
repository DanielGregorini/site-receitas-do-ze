const connection = require('../connection');
const TABLE = 'tb_pessoa';

//consultar as pessoas no banco de dados tabela pessoa
const getAll = async () => {

    const [query] = await connection.execute(
        `SELECT id, nome, email FROM ${TABLE}`
    );
    return query;

}

//obter uma pessoa pelo id
const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, nome, email FROM ${TABLE} WHERE  id = 
        ${id} LIMIT 1`
    );
    return query;
}

//insert
const create = async (pessoa) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (nome, email, senha) VALUES (
            "${pessoa.nome}", 
            "${pessoa.email}", 
            "${pessoa.senha}")`
    );
    return query;
}

//atualizar
const update = async (id, pessoa) => {
    const [query] = await connection.execute(
        `UPDATE ${TABLE} set
            "${pessoa.nome}", 
            "${pessoa.email} WHERE id = ${id}"`
    );
    return query;
}

//deletar uma pessoa do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAll, create, getById, update, remove}