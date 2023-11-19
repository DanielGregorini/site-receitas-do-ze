
async function ObterEExibirReceita() {

    //consulta a id da receita que está no link html
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const receitaId = urlParams.get('id');

    console.log('ID da Receita:', receitaId);

    //usa protocolo http para se conectar ao backend 
    //e requisita a receita com o determinado ip
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

//funcao que altera o html para mostrar a informações da receita na pagina
function MostrarReceita(receita) {

    //carrega os comentarios da pagina
    CarregarAvaliacoes(receita)

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

    // Adicione cada ingrediente à lista no html
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
    if (instrucoes[instrucoes.length - 1] == '') {
        instrucoes.pop();
    }

    //remove tudo dentro das instrucoesReceita no html
    instrucoesReceita.innerHTML = '';

    //Adiciona cada instrucao à lista no html
    instrucoes.forEach(instrucao => {
        const li = document.createElement('li');
        li.textContent = instrucao.trim();
        instrucoesReceita.appendChild(li);
    });
}

///////--Funções das avaliações--////////

//carrega todas as avaliações
async function CarregarAvaliacoes(receita) {

    //usa protocolo http para consultar todas as receitas e filtras as suas avaliações
    try {
        const response = await fetch(`http://localhost:3006/avaliacao/`);

        if (response.ok) {
            const avaliacoes = await response.json();
            FiltrarAvaliacoes(avaliacoes, receita.id, receita)

        } else {
            console.error('Erro ao buscar receitas');
        }
    } catch (error) {
        console.error('Erro na solicitação:', error);
    }

}

function FiltrarAvaliacoes(avaliacoes, idReceita, receita) {
    // Filtra as avaliações com base no id da receita
    const avaliacoesFiltradas = avaliacoes.filter(avaliacao =>
        avaliacao.receita_id == idReceita
    );

    const idUsuarioLogado = localStorage.getItem('id');

    // Separa as avaliações feitas pelo usuário logado das demais
    const avaliacoesDoUsuario = avaliacoesFiltradas.filter(avaliacao =>
        avaliacao.usuario_id == idUsuarioLogado
    );

    const outrasAvaliacoes = avaliacoesFiltradas.filter(avaliacao =>
        avaliacao.usuario_id != idUsuarioLogado
    );

    // Ordena as outras avaliações por mais recentes
    outrasAvaliacoes.sort((a, b) => new Date(b.data) - new Date(a.data));

    // Junta as avaliações do usuário logado e as outras avaliações ordenadas
    const avaliacoesOrdenadas = [...avaliacoesDoUsuario,...outrasAvaliacoes];

    console.log(avaliacoesOrdenadas);

    MostrarAvaliacoes( avaliacoesOrdenadas, receita);
    GerarNotaReceita(avaliacoesOrdenadas);
}


//calcula a media das notas dadas nas avaliações
function GerarNotaReceita(avaliacoes) {

    let notaMedia = 0;
    //se nao tiver nem uma valicao
    if (avaliacoes == null || avaliacoes.length == 0) {
        const avaliacaoReceita = document.getElementById('avaliacaoReceita');
        avaliacaoReceita.innerHTML = '';

        avaliacaoReceita.innerHTML = "Sem nota";
        return;
    }

    avaliacoes.forEach(avaliacao => {
        if (avaliacao.classificacao != null) {
            notaMedia = notaMedia + avaliacao.classificacao;
        }
    });

    notaMedia = notaMedia / avaliacoes.length;
    notaMedia = notaMedia.toFixed(2);

    const avaliacaoReceita = document.getElementById('avaliacaoReceita');
    avaliacaoReceita.innerHTML = '';
    avaliacaoReceita.innerHTML = "Nota: " + notaMedia + "/5";
}

async function MostrarAvaliacoes(avalicoes, receita) {
    const mainAvaliacoes = document.getElementById('comentarios_usuarios');
    const token = localStorage.getItem('token');

    console.log(avalicoes);

    for (const avaliacao of avalicoes) {
        const div = document.createElement('div');
        const h1 = document.createElement('h1');
        const p = document.createElement('p');
        const pAvalicao = document.createElement('p');
        const buttonDeletar = document.createElement('button');
        buttonDeletar.innerText = 'Deletar Avaliação';

        try {
            const response = await fetch(`http://localhost:3006/usuario/nome/` + avaliacao.usuario_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao obter o nome do usuário');
            }

            const usuario = await response.json();
            console.log(usuario);

            h1.textContent = usuario.nome;
            p.textContent = avaliacao.comentario;
            pAvalicao.textContent = "Nota: " + avaliacao.classificacao;
            div.appendChild(h1);
            div.appendChild(p);
            div.appendChild(pAvalicao);

            const IdUsuarioLogado = localStorage.getItem('id');

            if (usuario.id == IdUsuarioLogado) {
                buttonDeletar.setAttribute("id_avaliacao", avaliacao.id);
                buttonDeletar.id = "botao_deletar_avaliacao";
                div.appendChild(buttonDeletar);
            }

            mainAvaliacoes.appendChild(div);
        } catch (error) {
            console.error('Erro ao pegar o nome do usuário:', error);
        }
    }

    mainAvaliacoes.addEventListener('click', async function (event) {
        const target = event.target;

        // Verifica se o botão Deletar foi clicado
        if (target.tagName === 'BUTTON' && target.id === 'botao_deletar_avaliacao') {
            // Obtém o ID da avaliação do atributo de dados
            const idAvaliacao = target.getAttribute('id_avaliacao');

            console.log('ID da Avaliacao para exclusão:', idAvaliacao);
            // Obtém o token de autenticação do localStorage
            const token = localStorage.getItem('token');

            // Construa a URL para a exclusão da receita
            const URL = `http://localhost:3006/avaliacao/${idAvaliacao}`;

            try {
                const response = await fetch(URL, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                    },
                });

                if (response.ok) {
                    console.log('avaliacao excluída com sucesso!');
                    location.reload();
                } else {
                    console.error('Erro ao excluir a avaliacao:', response.statusText);
                }
            } catch (error) {
                console.error('Erro durante a chamada à API:', error);
            }
        }
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
    }).then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    //quaso o usuario nao esteja logado será mandado para a pagina de login
                    console.error('Não logado');
                    window.location.href = "login.html";
                    alert('Falha na autenticação, redirecionando para a página de login.');
                } else {
                    throw new Error('Erro na solicitação: ' + response.status);
                }
            }
            return response.json();
        }).then(data => {
            console.log('Avaliação cadastrada com sucesso:', data);
            window.location.reload();
            // Faça algo após cadastrar a avaliação, se necessário
        }).catch(error => {
            console.error('Erro ao cadastrar avaliação:', error);
            // Faça algo em caso de erro
        });
}

function SalvarBusca(){
    LimparPesquisa();
    const pesquisa = document.getElementById('botao_pesquisa').value

    //verifica se a pesquisa não é nula ou vazia
    if(pesquisa){
        localStorage.setItem('pesquisa', pesquisa);
        window.location.href = "busca.html";

    }
}

function LimparPesquisa(){
    localStorage.removeItem('pesquisa');
}

//inicia o processor de inserir os dados da receita na pagina
ObterEExibirReceita();
LimparPesquisa();