
async function ObterEExibirReceita() {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');

    console.log('ID da Receita:', receitaId);

    try {
        const response = await fetch(`http://localhost:3006/receita/` + receitaId);

        if (response.ok) {
            const receita = await response.json();
            MostrarReceita(receita);
        } else {
            console.error('Erro ao buscar receitas');
        }
    } catch (error) {
        console.error('Erro na solicitação:', error);
    }
}

function MostrarReceita(receita) {

    //carrega os comentarios da pagina
    CarregarAvaliacoes(receita.id)

    //adiciona o titulo na pagina
    const tituloReceita = document.getElementById('nome_receita');
    tituloReceita.textContent = receita.titulo;
   
    //adiciona a descrecao na pagina
    const descricaReceita = document.getElementById('descricao_receita');
    descricaReceita.textContent = receita.descricao;

    const ingredientesReceita = document.getElementById('ingredientes_receita');

    //separa os ingredientes pelo ';'
    const ingredientes = receita.ingredientes.split(';');
    //apaga qualquer elemento dentro da lista
    ingredientesReceita.innerHTML = '';

    // Adicione cada ingrediente à lista
    ingredientes.forEach(ingrediente => {
        const li = document.createElement('li');
        li.textContent = ingrediente; 
        ingredientesReceita.appendChild(li);
    });

    const instrucoesReceita = document.getElementById('lista_instrucoes')
    
    //apaga qualquer elemento dentro da lista
    
    //tranforma as intrucoes em um vetor separado por ;
    const instrucoes = receita.instrucoes.split(';');

    //caso o ultimo seja nao tenha nada apaga
    if(instrucoes[instrucoes.length - 1] == ''){
        instrucoes.pop();
    }
    
    //remove tudo dentro das instrucoesReceita no html
    instrucoesReceita.innerHTML = '';
    
    instrucoes.forEach(instrucao => {
        const li = document.createElement('li');
        li.textContent = instrucao.trim(); 
        instrucoesReceita.appendChild(li);
    });

    
}

async function CarregarAvaliacoes(idReceita){

    //alert("edddsdfsdf")
    try {
        const response = await fetch(`http://localhost:3006/avaliacao/`);

        if (response.ok) {
            const avaliacoes = await response.json();
            FiltrarAvaliacoes(avaliacoes, idReceita)

        } else {
            console.error('Erro ao buscar receitas');
        }
    } catch (error) {
        console.error('Erro na solicitação:', error);
    }

}

function FiltrarAvaliacoes(avaliacoes, idReceita) {
    // Filtra as avaliações com base no id da receita
    const avaliacoesFiltradas = avaliacoes.filter(avaliacao =>
        avaliacao.receita_id == idReceita
    );

    MostrarAvaliacoes(avaliacoesFiltradas);
}

function MostrarAvaliacoes(avalicoes) {

    mainAvaliacoes = document.getElementById('comentarios_usuarios');
    const token = localStorage.getItem('token');

    avalicoes.forEach(avaliacao => {
        // Cria os elementos para inserir no HTML
        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const p = document.createElement('p');

        // Realiza a chamada AJAX de forma síncrona para obter o nome do usuário
        const result = fetch(`http://localhost:3006/usuario/` + avaliacao.usuario_id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
            .then(response => response.json())
            .then(usuario => {
                //o titulo do comentario
                h1.textContent = usuario.nome; // Adiciona o nome do usuário ao h1
            })
            .catch(error => {
                console.error('Erro ao pegar o nome do usuário:', error);
            });

        p.textContent = avaliacao.comentario;

        div.appendChild(h1);
        div.appendChild(p);

        mainAvaliacoes.appendChild(div);
    });
}

//Funcoes de insercao de comentario da receita //

function CadastrarAvaliacao() {
    
    const comentario = document.getElementById('comentario').value;
    const rating = document.getElementById('rating_receita').value;
    const token = localStorage.getItem('token');
    const autorId = localStorage.getItem('id');

    const palavras = comentario.split(/\s+/).length; // Conta o número de palavras

    if (palavras < 5) {
        alert('O comentário deve ter pelo menos 5 palavras.');
        return;
    } 
    //id da receita
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');

    const url = 'http://localhost:3006/avaliacao';
   
    const dados = {
        receita_id: parseInt(receitaId),
        usuario_id: parseInt(autorId),
        classificacao: parseInt(rating),
        comentario: comentario,
        data_avaliacao: new Date().toISOString().split('T')[0] // Obtém a data atual no formato 'YYYY-MM-DD'
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(dados)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Avaliação cadastrada com sucesso:', data);
        window.location.reload();
        // Faça algo após cadastrar a avaliação, se necessário
    })
    .catch(error => {
        console.error('Erro ao cadastrar avaliação:', error);
        // Faça algo em caso de erro
    });
}


//inicia o processor de inserir os dados da receita na pagina
ObterEExibirReceita();