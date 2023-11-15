
async function CarregarReceitas() {
    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('id');
    
    try {
        const response = await fetch(`http://localhost:3006/receita/`);

        if (response.ok) {
            const receitas = await response.json();
            
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

function ExibirReceitas(receitas){
    
    const listaReceitas = document.getElementById('lista_de_receitas');
    
    receitas.forEach(receita => {
       
        //cria os elementos que vao ser inseridos no html
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        const a = document.createElement('a');
        
        a.textContent = "ID: " + receita.id + " "+ receita.titulo;
        a.href = `adm_receita.html?id=${receita.id}`;
        li.appendChild(a);
        listaReceitas.appendChild(li);
    });
}

CarregarReceitas();