
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

function MostrarAvaliacoes (avalicoes){
    
    mainAvaliacoes = document.getElementById('comentarios_usuarios');
    
    avalicoes.forEach(avaliacao => {
        //crias os elementos para inserir no html
        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const p = document.createElement('p');
        
        //inseri o comentario e o id do usuario que fez o comentario
        p.textContent = avaliacao.comentario;
        h1.textContent = avaliacao.usuario_id;
    
        div.appendChild(h1);
        div.appendChild(p);
       
        mainAvaliacoes.appendChild(div);
       
    });
    
}

//inicia o processor de inserir os dados da receita na pagina
ObterEExibirReceita();