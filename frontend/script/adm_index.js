
async function CarregarReceitas() {
    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('id');
    
    try {
        
        const response = await fetch(`http://localhost:3006/receita/`);
        
        if (response.ok) {

            const receitas = await response.json();
            
            //se o usuario nao tiver nem uma receita
            if (receitas) {

                const lista = document.getElementById('lista_de_receitas');
                const h1 = document.createElement('h1');
                h1.textContent = 'Sem receitas';
                lista.appendChild(h1);
                
            }
            
            FiltrarEOrdenarReceitas(receitas, usuario_id);
        } else {
            console.error('Erro ao buscar receitas');
        }
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
    }
}

function FiltrarEOrdenarReceitas(receitas, filtro) {
    
    console.log(receitas); 
    console.log(filtro);   
    
    let receitasFiltradas = receitas.filter(receita =>
        receita.id_usuario == filtro
    );
     
    ExibirReceitas(receitasFiltradas);
}

function ExibirReceitas(receitas) {
    const listaReceitas = document.getElementById('lista_de_receitas');

    receitas.forEach(receita => {
        // Cria os elementos que vão ser inseridos no HTML
        const a = document.createElement('a');
        const li = document.createElement('li');
        const buttonExcluir = document.createElement('button');

        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        buttonExcluir.classList.add('btn', 'btn-danger', 'ml-auto');
        
        // Atribui o valor do id da receita ao atributo personalizado 'data-id'
        buttonExcluir.setAttribute('data-id', receita.id);
        
        buttonExcluir.textContent = 'Excluir';

        //link para a pagina de edição da receita
        a.textContent = "ID: " + receita.id + " " + receita.titulo;
        a.href = `adm_receita.html?id=${receita.id}`;
        
        li.appendChild(a);
        li.appendChild(buttonExcluir);
        listaReceitas.appendChild(li);
    });

    // Adiciona um ouvinte de evento para os botões de exclusão
    listaReceitas.addEventListener('click', async function (event) {
        const target = event.target;
    
        // Verifica se o botão de exclusão foi clicado
        if (target.tagName === 'BUTTON' && target.classList.contains('btn-danger')) {
            // Obtém o valor do id da receita do atributo personalizado 'data-id'
            const idReceita = target.getAttribute('data-id');
    
            console.log('ID da Receita para exclusão:', idReceita);
    
            // Obtém o token de autenticação do localStorage
            const token = localStorage.getItem('token');
    
            // Construa a URL para a exclusão da receita
            const URL = `http://localhost:3006/receita/${idReceita}`;
    
            try {
                const response = await fetch(URL, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': token,
                    },
                });
    
                if (response.ok) {
                    console.log('Receita excluída com sucesso!');
                    location.reload();
                } else {
                    console.error('Erro ao excluir a receita:', response.statusText);
                }
            } catch (error) {
                console.error('Erro durante a chamada à API:', error);
            }
        }
    });
    
}

CarregarReceitas();