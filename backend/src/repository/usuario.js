const connection = require('../connection');
const TABLE = 'tb_usuario';

//obter todos os usuarios
const getAll = async () => {

    const [query] = await connection.execute(
        `SELECT id, nome, email, nascimento, telefone FROM ${TABLE}`
    );
    return query;
}

//obter um usuario pelo id
const getById = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, nome, email, nascimento, telefone FROM ${TABLE} WHERE  id = 
        ${id} LIMIT 1`
    );
    return query;
}

const getByEmailAndPassoword = async (email, password) => {

    const [rows] = await connection.execute(
        `SELECT id, nome, email, senha FROM ${TABLE} WHERE email = ? AND senha = ? LIMIT 1`,
        [email, password]
      );

    return rows;
}


//obter uma login
const getLogin = async (usuario) => {
    try {
      const [rows] = await connection.execute(
        `SELECT id, nome, email FROM ${TABLE} WHERE email = ? AND senha = ? LIMIT 1`,
        [usuario.email, usuario.senha]
      );
  
      // Verifique o número de linhas no resultado
      const rowCount = rows.length;
  
      return rowCount;
    } catch (error) {
      // Lide com erros aqui, por exemplo, registrando ou lançando uma exceção
      console.error('Erro na consulta: ' + error);
      throw error;
    }
  };


//insert
const create = async (usuario) => {
    const [query] = await connection.execute(
        `INSERT INTO ${TABLE} (nome, email, senha, nascimento, telefone) VALUES (
            "${usuario.nome}", 
            "${usuario.email}", 
            "${usuario.senha}",
            "${usuario.nascimento}",
            "${usuario.telefone}")`
    );
    return query;
}

//atualizar
const update = async (id, usuario) => {
    const [query] = await connection.execute(
        `UPDATE ${TABLE} SET nome = ?, email = ?, nascimento = ?, telefone = ? WHERE id = ?`,
        [usuario.nome, usuario.email, usuario.nascimento, usuario.telefone, id]
    );
    
    return query;
}

//deletar um usuario do banco de dados
const remove = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAll, create, getById, update, remove, getLogin, getByEmailAndPassoword}