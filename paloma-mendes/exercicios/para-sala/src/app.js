const express = require("express")
const cors = require("cors")
const alunasRotas = require("./routes/alunaRotas")
const app = express()

app.use(express.json())
app.use(cors())

//Rota inicial da API
app.get("/", (request, response) => {
    response.status(200).send("API ONNN")
})

app.use("/alunas", alunasRotas)

module.exports = app