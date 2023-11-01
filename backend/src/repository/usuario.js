const connection = require('../connection');
const TABLE = 'tb_usuario';

//consultar os usuarios no banco de dados tabela pessoa
const getAllUsuario = async () => {

    const [query] = await connection.execute(
        `SELECT id, nome, email, nascimento, telefone FROM ${TABLE}`
    );
    return query;
}

//obter uma pessoa pelo id
const getByIdUsuario = async (id) => {
    const [query] = await connection.execute(
        `SELECT id, nome, email, nascimento, telefone FROM ${TABLE} WHERE  id = 
        ${id} LIMIT 1`
    );
    return query;
}

//obter uma login
const getLoginUsuario = async (usuario) => {
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
const updateUsuario = async (id, usuario) => {
    const [query] = await connection.execute(
        `UPDATE ${TABLE} SET nome = ?, email = ?, nascimento = ?, telefone = ? WHERE id = ?`,
        [usuario.nome, usuario.email, usuario.nascimento, usuario.telefone, id]
    );
    
    return query;
}

//deletar um usuario do banco de dados
const removeUsuario = async (id) => {
    const [query] = await connection.execute(
        `DELETE FROM ${TABLE} WHERE id=${id}`
    );
    return query;
}
 
module.exports = {getAllUsuario, create, getByIdUsuario, updateUsuario, removeUsuario, getLoginUsuario}