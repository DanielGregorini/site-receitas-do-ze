var URL_BASE = 'http://localhost:3006/login/';

async function LoginUsuario() {
    try {
        
        localStorage.clear();

        // Objeto que contém a referência para todos os campos do formulário
        const form = {
            login: document.getElementById('login'),
            senha: document.getElementById('senha'),
        }

        // Dados que serão enviados para o backend via HTTP
        const dados = {
            username: form.login.value,
            password: form.senha.value
        };

        // Requisição para o backend
        const result = await fetch(URL_BASE, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (result.ok) {
            // Se a requisição for bem-sucedida, obtenha o resultado em formato JSON
            const resultJson = await result.json();
            localStorage.clear();
            // Armazena os dados no localStorage
            localStorage.setItem('token', resultJson.token);
            localStorage.setItem('id', resultJson.user.id);
            localStorage.setItem('username', resultJson.user.email);

            // Redireciona para "index.html"
            window.location.href = "index.html";
        } else {
            // Se a requisição falhar, lança um erro
            throw new Error("Erro ao realizar login");
        }
    } catch (error) {
        // Se ocorrer um erro, exibe uma mensagem de alerta
        console.error("Erro ao processar os dados do login:", error);
        alert("Ocorreu um erro ao processar os dados do login. Por favor, tente novamente.");
    }
}