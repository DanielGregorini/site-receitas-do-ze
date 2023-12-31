
function GerarPerfil() {

    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('id');

    //requisição http para coletar os dados do usuario
    fetch(`http://localhost:3006/usuario/` + usuario_id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    })
        .then(response => {
            if (!response.ok) {
                //caso o token seja invalido
                if (response.status === 401) {
                    // Caso o usuário não esteja logado, será redirecionado para a página de login

                    console.error('Não logado');
                    window.location.href = "../login.html";
                    //alert('Falha na autenticação, redirecionando para a página de login.');
                } else {
                    throw new Error('Erro na solicitação: ' + response.status);
                }
            }
            return response.json();
        })
        .then(usuario => {

            //coleta os elementos no html que serão inseridos os dados do usuario
            const NomeCompletoPerfil = document.getElementById('perfil_nomecompleto');
            const NomePerfil = document.getElementById('nome_perfil');
            const EmailPerfil = document.getElementById('perfil_email');
            const TelefonePerfil = document.getElementById('perfil_telefone');
            const NascimentoPerfil = document.getElementById('perfil_nascimento');

            //limpa o html
            NomeCompletoPerfil.innerHTML = ''
            NomePerfil.innerHTML = ''
            EmailPerfil.innerHTML = ''
            TelefonePerfil.innerHTML = ''
            NascimentoPerfil.innerHTML = ''

            //coleta o primeiro nome
            const partesNome = usuario.nome.split(' ');
            // Pegar o primeiro elemento (primeiro nome)
            const primeiroNome = partesNome[0];

            //insere no html os dados do usuario
            NomePerfil.textContent = primeiroNome;
            NomeCompletoPerfil.textContent = usuario.nome;
            EmailPerfil.textContent = usuario.email;
            TelefonePerfil.textContent = usuario.telefone;
            const dataNascimento = new Date(usuario.nascimento);

            const dia = dataNascimento.getDate();
            const mes = dataNascimento.getMonth() + 1;
            const ano = dataNascimento.getFullYear();

            // Formate a data para o formato "YYYY-MM-DD"
            const dataFormatada = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

            // Atualizar o conteúdo do elemento HTML
            NascimentoPerfil.textContent = dataFormatada;

            //elementos onde os dados setão editados
            const form = {
                nome: document.getElementById('nomeNovo'),
                email: document.getElementById('emailNovo'),
                nascimento: document.getElementById('nascimentoNovo'),
                telefone: document.getElementById('telefoneNovo')
            };

            //insere os dados do usuario nos campos da edição
            form.nome.value = usuario.nome;
            form.email.value = usuario.email;
            form.telefone.value = usuario.telefone;
            form.nascimento.value = dataFormatada;

        })
        .catch(error => {
            console.error('Erro ao pegar o nome do usuário:', error);
        });
}

//função para atualizar o cadastro

function AtualizarCadastro() {
    const token = localStorage.getItem('token');
    const usuario_id = localStorage.getItem('id');

    const form = {
        nome: document.getElementById('nomeNovo').value,
        email: document.getElementById('emailNovo').value,
        nascimento: document.getElementById('nascimentoNovo').value,
        telefone: document.getElementById('telefoneNovo').value
    };

    // Verifica se a data é válida antes de formatar
    let dataFormatada;
    if (form.nascimento) {
        const valorData = form.nascimento;
        const data = new Date(valorData);

        // Verifica se a data é válida
        if (!isNaN(data.getTime())) {
            const ano = data.getFullYear();
            const mes = (data.getMonth() + 1).toString().padStart(2, '0');
            const dia = data.getDate().toString().padStart(2, '0');
            dataFormatada = `${ano}-${mes}-${dia}`;
        } else {
            console.error('Data de nascimento inválida.');
            // Adicione uma lógica apropriada para lidar com datas inválidas, como exibir uma mensagem para o usuário.
            return;
        }
    }

    // Dados que serão enviados para o backend via HTTP
    const dadosNovos = {
        nome: form.nome,
        email: form.email,
        nascimento: dataFormatada,
        telefone: form.telefone
    };

    // Requisição HTTP para atualizar os dados do usuário
    fetch(`http://localhost:3006/usuario/` + usuario_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(dadosNovos)
    })

        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Não logado');
                    window.location.href = "../login.html";
                } else if (response.status === 400) {
                    console.error('Email já cadastrado');

                    // Você pode exibir uma mensagem de erro para o usuário aqui
                    alert('O e-mail já está cadastrado. Por favor, escolha outro.');
                } else {
                    throw new Error('Erro na solicitação: ' + response.status);
                }
            }
            return response.json();
        })
        .then(usuario => {
            // Lógica adicional após a atualização do usuário, se necessário
            console.log('Usuário atualizado:', usuario);
            location.reload();
        })
        .catch(error => {
            console.error('Erro ao atualizar o usuário:', error);
        });

}

function DeletarConta() {
   
    // Confirmação do usuário antes de excluir a conta
    var confirmacao = confirm("Tem certeza de que deseja excluir sua conta? Essa ação não pode ser desfeita!");
  
    if (confirmacao) {
      // Lógica para excluir a conta (chame a API, etc.)
      // Substitua este código pelo necessário para excluir a conta
      const token = localStorage.getItem('token');
      const id = localStorage.getItem('id')
  
      fetch('http://localhost:3006/usuario/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      })
        .then(response => {
          if (response.ok) {
            console.log('Conta excluída com sucesso!');
            // Redirecionar para a página de login ou outra página apropriada
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            window.location.href = '../index.html';

          } else {
            console.error('Erro ao excluir a conta:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Erro durante a chamada à API:', error);
        });
    }
  }
//chama a funcao para construição do perfil
GerarPerfil();