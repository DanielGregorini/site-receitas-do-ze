
function alterarFuncao() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');
    
    const botao_ = document.getElementById('botao')
 

    // Verificar se há um ID na URL
    if (receitaId) {
        botao_.innerText = 'Editar';
        
        botao_.onclick = EditarReceita;

        const titulo = document.getElementById('titulo');
        titulo.innerText = "Editar receita"; 

    } else {
        // Se não houver um ID, estamos adicionando
        botao_.onclick = CriarNovaReceita;
        botao_.innerText = 'Adicionar';
    }
}

function EditarReceita(){
    
    const token = localStorage.getItem('token');
    const URL_BASE = 'http://localhost:3006/receita/'
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');
    const usuarioId = localStorage.getItem('id');

    const titulo_receita_nova = document.getElementById('titulo_receita_nova');
    const descricao_receita_nova = document.getElementById('descricao_receita_nova');
    const ingredientes_receita_nova = document.getElementById('ingredientes_receita_nova');
    const passos_receita_nova = document.getElementById('passoapasso_receita_nova');
    

    const receita = {
        titulo: titulo_receita_nova.value,
        descricao: descricao_receita_nova.value,
        ingredientes: ingredientes_receita_nova.value,
        instrucoes: passos_receita_nova.value,  
        id_usuario: usuarioId
    }
    
    fetch(URL_BASE + receitaId, {
        method: "put",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(receita)
    })
    .then(result => {
         if (result.status === 404 || result.status === 401) {
            alert("Erro: Receita não encontrada ou não autorizado");
            return result.json();
        } 
    })
    .then(data => {
        console.log(data); // Faça algo com a resposta, se necessário
        alert("Receita atualizada com sucesso!");
        // Redirecione ou faça outras ações após a atualização bem-sucedida
    })
    .catch(err => {
        console.error(err);
        alert("Falha ao atualizar receita. Por favor, tente novamente.");
    });

}

function CriarNovaReceita(){
    const URL_BASE = 'http://localhost:3006/receita/'
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('id');

    //coletando os elementos que fora inseridos os dados
    const titulo_receita_nova = document.getElementById('titulo_receita_nova');
    const descricao_receita_nova = document.getElementById('descricao_receita_nova');
    const ingredientes_receita_nova = document.getElementById('ingredientes_receita_nova');
    const passos_receita_nova = document.getElementById('passoapasso_receita_nova');
    
    //formatando a data
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); 
    const dia = String(dataAtual.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    
    const receita = {
        titulo: titulo_receita_nova.value,
        descricao: descricao_receita_nova.value,
        ingredientes: ingredientes_receita_nova.value,
        instrucoes: passos_receita_nova.value,  
        id_usuario: usuarioId,
        criacao: dataFormatada  
    }

    fetch(URL_BASE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(receita)
    })
    .then(result => {
        if (result.status === 200 || result.status === 201) {
            return result.json();
        } else {
            throw new Error("Falha ao inserir receita. Por favor, tente novamente.");

        }
    })
    .then(usuario => {
        console.log(usuario);
        alert("Receita nao cadastrada!");
        
        setTimeout(function() {
            window.location.href = "login.html";
        }, 500); // 2000 milissegundos (2 segundos)
    })
    .catch(err => {
        console.error(err);
        alert("Falha ao cadastrar receita. Por favor, tente novamente.");
      
    });
}

alterarFuncao();