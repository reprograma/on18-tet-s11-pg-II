const express = require("express")

const cors = require("cors")

const alunasRotas = require("./routes/alunasRoutes")

const app = express()

app.use(express.json())

app.use(cors())

app.get("/", (request, response) => {
    response.status(200).send("API funcionando!!!")
})

app.use("/alunas", alunasRotas)

module.exports = app
