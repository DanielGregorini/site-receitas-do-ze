
//funcao para pesquisa, chamada no botão de pesquisa do header
function SalvarBusca(){
    LimparPesquisa();
    const pesquisa = document.getElementById('botao_pesquisa').value

    //verifica se a pesquisa não é nula ou vazia
    if(pesquisa){
        localStorage.setItem('pesquisa', pesquisa);
        window.location.href = "busca.html";

    }
}

//nos botões de categoria salva pesquisa em encaminha para pagina de pesquisa
function SalvarBuscaCategoria(categoria) {
    LimparPesquisa();
    
    // Verifica se a categoria não é nula ou vazia
    if (categoria) {
        localStorage.setItem('pesquisa', categoria);
        window.location.href = "busca.html";
    }
}

//requisita do backend todas as receitas para funcao ExibirReceitasAleatorias
//selecionar aleatoriamente 6 receitas
async function ReceitasAleatorias(){
    const URL = 'http://localhost:3006/receita';
    
     try {
        const response = await fetch(URL, {});
           
        if (response.ok) {

            const receitas = await response.json();
                
            ExibirReceitasAleatorias(receitas);
              
        } else {
            console.error('Erro ao obter as receitas:', response.statusText);
        }
    } catch (error) {
        console.error('Erro durante a chamada à API:', error);
    }
    
}

//carrega a sessão do site com algumas receitas aleatórias
async function ExibirReceitasAleatorias(receitas) {
    //gera uma lista aleatoria de receitas

    for (let i = receitas.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [receitas[i], receitas[j]] = [receitas[j], receitas[i]];
    }
    const receitas_ = receitas.slice(0, 6);

    console.log(receitas_)

    const ListaDeReceitas = document.getElementById('lista_receitas_recomendadas');
    //insere no html
    receitas_.forEach(receita => {
      
        const a = document.createElement('a');
        a.href = 'receita.html?id=' + receita.id;

        const img = document.createElement('img');
        img.src = 'imagens/macarao.png'; 

        a.appendChild(img);
        ListaDeReceitas.appendChild(a);
    });
}

//limpar a pesquisa no storeage
function LimparPesquisa(){
    localStorage.removeItem('pesquisa');
}

//chama as funções usadas na pagina
LimparPesquisa();
ReceitasAleatorias();