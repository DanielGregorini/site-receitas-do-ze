//importacoes
const express = require("express");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3005;

app.listen(PORT, () => {
    console.log(`App executando na porta ${PORT}`);
    console.log(`BACKEND do projeto receitas-do-zé`);
    

});

app.get("/", async (req, res) => {
    return res.send("APLI na escuta!!");
});

app.use("/pessoa", require('./routes/pessoa'));
app.use("/avaliacao", require('./routes/avaliacao'));
app.use("/receita", require('./routes/receita'));
app.use("/usuario", require('./routes/usuario'));