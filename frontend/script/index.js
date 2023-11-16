
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

LimparPesquisa();