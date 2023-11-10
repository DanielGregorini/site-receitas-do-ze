//url do backend
var URL_BASE = 'http://localhost:3006/usuario/';

function CadastrarUsuario() {
    
    // Objeto que contém a referência para todos os campos do formulário
    const form = {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        nascimento: document.getElementById('nascimento'),
        telefone: document.getElementById('telefone')
    }
    
    //formata a data
    const valorData = form.nascimento.value;
    const data = new Date(valorData);
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    
    //dados que seram mandados para o backend via http
    const dados = {
        nome: form.nome.value,
        email: form.email.value,
        senha: form.senha.value,
        nascimento: dataFormatada,
        telefone: form.telefone.value
    };
    
    fetch(URL_BASE, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
    .then(result => {
        if (result.status === 200 || result.status === 201) {
            return result.json();
        } else {
            throw new Error("Falha ao cadastrar usuário. Por favor, tente novamente.");

        }
    })
    .then(usuario => {
        console.log(usuario);
        alert("Usuário cadastrado com sucesso!");
        LimparDados()
    })
    .catch(err => {
        console.error(err);
        alert("Falha ao cadastrar usuário. Por favor, tente novamente.");
        LimparDados()
    });

}

//limpar os dados do form se o usuario for inserido ou falhar
function LimparDados(){
    const form = {
        nome: document.getElementById('nome'),
        email: document.getElementById('email'),
        senha: document.getElementById('senha'),
        nascimento: document.getElementById('nascimento'),
        telefone: document.getElementById('telefone')
    } 

    Object.values(form).forEach(f => f.value = "");
}