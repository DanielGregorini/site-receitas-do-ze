
/*
    Se o usuario selecionou uma receita no indexAdm, a funcao altera a pagina para edição
mudando o titulo da pagina e já carregando os dados da receita nos campos de edição. Também
também alterando o botão para chamar a função de edição.
     Caso não tenha id na URL a função deixa como está a pagina como de criação de nova
Receitas.*/ 

function alterarFuncao() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');    
    const botao_ = document.getElementById('botao')

    // Verificar se há um ID na URL
    if (receitaId) {

        const token = localStorage.getItem('token');
        botao_.innerText = 'Editar';
        botao_.onclick = EditarReceita;
        const titulo = document.getElementById('titulo');
        titulo.innerText = "Editar receita"; 
        const URL_BASE = 'http://localhost:3006/receita/'
        
        fetch(URL_BASE + receitaId, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            
        })
        .then(result => {
            if (!result.ok) {
                //caso o token seja invalido
                if (result.status === 401) {
                    // Caso o usuário não esteja logado, será redirecionado para a página de login
    
                    console.error('Não logado');
                    window.location.href = "../login.html";
                    alert('Falha na autenticação, redirecionando para a página de login.');
                }
            }
            return result.json();
        })
        .then(receita => {

            console.log(receita);
            //insere os dados da receita nas caixas de edição
            const titulo_receita_nova = document.getElementById('titulo_receita_nova');
            const descricao_receita_nova = document.getElementById('descricao_receita_nova');
            const ingredientes_receita_nova = document.getElementById('ingredientes_receita_nova');
            const passos_receita_nova = document.getElementById('passoapasso_receita_nova');

            titulo_receita_nova.value = receita.titulo;
            descricao_receita_nova.value = receita.descricao;
            ingredientes_receita_nova.value = receita.ingredientes;
            passos_receita_nova.value = receita.instrucoes;

        })
        .catch(err => {
            console.error(err);
            alert("Não foi possivel consultar os dados da receita");
        });
    } else {
        // Se não houver um ID, estamos adicionando
        titulo.innerText = "Adicionar receita"; 
        botao_.onclick = CriarNovaReceita;
        botao_.innerText = 'Adicionar';
    }
}

//funcao para edição de uma receita
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
        window.location.href = "adm_index.html";
        // Redirecione ou faça outras ações após a atualização bem-sucedida
    })
    .catch(err => {
        console.error(err);
        alert("Falha ao atualizar receita. Por favor, tente novamente.");
    });

}

//função para criar uma nova receita
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
        alert("Receita cadastrada!");
        window.location.href = "adm_index.html";
    })
    .catch(err => {
        console.error(err);
        alert("Falha ao cadastrar receita. Por favor, tente novamente.");
      
    });
}

alterarFuncao();