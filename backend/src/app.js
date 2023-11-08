//importacoes
const express = require("express");
const cors = require('cors');
const { getLogin } = require("./repository/usuario");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3006;

app.listen(PORT, () => {
    console.log(`-- BACKEND do projeto receitas do zé --`);
    console.log(`App executando na porta ${PORT}`);
    
});

app.get("/", async (req, res) => {
    return res.send("APLI na escuta!!");
});

app.use("/login", require('./routes/login'));
app.use("/avaliacao", require('./routes/avaliacao'));
app.use("/receita", require('./routes/receita'));
app.use("/usuario", require('./routes/usuario')); 