
//adiciona um evento no botão, requisitando no backend todas as receitas
document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('botao_confirmar').addEventListener('click', async () => {
        const termoPesquisa = document.getElementById('input_buscar').value;
        const response = await fetch(`http://localhost:3006/receita/`);

        console.log(termoPesquisa);
        
        if (response.ok) {
            const receitas = await response.json();
            
            FiltrarEOrdenarReceitas(receitas, termoPesquisa)

        } else {
            console.error('Erro ao buscar receitas');
        }
    });
});

//funcao filtra todas as receitas com o termo de busca inserido nos seus atributos
function FiltrarEOrdenarReceitas(receitas, filtro){

    console.log(receitas);
    console.log(filtro);
    const termoPesquisa = document.getElementById('input_buscar');
    termoPesquisa.value = filtro;

    let receitasFiltradas = receitas.filter(receita =>
        receita.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
        receita.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
        receita.ingredientes.toLowerCase().includes(filtro.toLowerCase()) ||
        receita.instrucoes.toLowerCase().includes(filtro.toLowerCase())
    );
    
    receitas = receitasFiltradas
    exibirReceitas(receitas);
}

//função responsavel por carregar na pagina as receitas já filtradas
function exibirReceitas(receitas) {
    const mainElement = document.querySelector('main');
    mainElement.innerHTML = ''; // Limpa o conteúdo existente na main
    
    console.log(receitas);

    if(receitas.length < 1){

        const divReceita = document.createElement('div');
        divReceita.textContent = "Sem Receita"
        mainElement.appendChild(divReceita);
    }

    //corre o vetor das receitas a adicionando
    receitas.forEach(receita => {

        //cria os elementos
        const divReceita = document.createElement('div');
        const linkReceita = document.createElement('a');
        const pDescricao = document.createElement('p');
        
        //cria o link para a determinada receita
        linkReceita.href = `receita.html?id=${receita.id}`;
        linkReceita.textContent = receita.titulo;
        pDescricao.textContent = receita.descricao;
        divReceita.appendChild(linkReceita);
        divReceita.appendChild(pDescricao);
        
        //insere no documento
        mainElement.appendChild(divReceita);
    });
}

//se ja houver uma pesquisa salva no localstorage essa funcao carrega a pesquisa
async function PesquisaAutomatica() {

    const URL = 'http://localhost:3006/receita';
    const pesquisa = localStorage.getItem('pesquisa');
    localStorage.removeItem('pesquisa');
    console.log("termo salvo:",pesquisa)

    //se existe uma pesquisa já salva
    if(pesquisa){
        
        try {
            const response = await fetch(URL, {});
    
            if (response.ok) {
                const receitas = await response.json();
                FiltrarEOrdenarReceitas(receitas, pesquisa);
            } else {
                console.error('Erro ao obter as receitas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro durante a chamada à API:', error);
        }
    }   
}

// Chama PesquisaAutomatica após o carregamento da página
PesquisaAutomatica();