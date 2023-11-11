document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('botao_confirmar').addEventListener('click', async () => {
        const termoPesquisa = document.getElementById('input_buscar').value;
        const response = await fetch(`http://localhost:3006/receita/`);
        
        if (response.ok) {
            const receitas = await response.json();
            FiltrarEOrdenarReceitas(receitas, termoPesquisa)

            //exibirReceitas(receitas);
        } else {
            console.error('Erro ao buscar receitas');
        }
    });

    function exibirReceitas(receitas) {

        const mainElement = document.querySelector('main');
        mainElement.innerHTML = ''; // Limpa o conteúdo existente na main
        
        receitas.forEach(receita => {
            const divReceita = document.createElement('div');
            const linkReceita = document.createElement('a');
            const pDescricao = document.createElement('p');
            
            linkReceita.href = `receita.html?id=${receita.id}`;
            linkReceita.textContent = receita.titulo;
            
            pDescricao.textContent = receita.descricao;
            
            divReceita.appendChild(linkReceita);
            divReceita.appendChild(pDescricao);
            
            mainElement.appendChild(divReceita);
        });
    }



    function FiltrarEOrdenarReceitas(receitas, filtro){
        
        console.log(receitas);
        console.log(filtro);

        let receitasFiltradas = receitas.filter(receita =>

            receita.titulo.includes(filtro) ||
            receita.descricao.includes(filtro) ||
            receita.ingredientes.includes(filtro) ||
            receita.instrucoes.includes(filtro)

        );
        receitas = receitasFiltradas
        exibirReceitas(receitas);

    }

});