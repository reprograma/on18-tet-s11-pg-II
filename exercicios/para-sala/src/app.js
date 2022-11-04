//inicia a API
const express = require("express")

//exportar dependencia de config. do projeto

const cors = require("cors") 

//IMPORTANDO ROTAS
const alunasRotas = require("./routes/alunaRotas")

const app = express()

//Que transforma o texto que chega em um objeto JS
app.use(express.json()) 

// Habilita o comportamento de recurso da API
app.use(cors()) 

//rota inicial da API
//validando se está funcionando
app.get("/", (req, res) => {
    res.status(200).send("API OOONNNNNNNNN")
})

app.use("/alunas", alunasRotas)

module.exports = app