const express = require("express")
const cors = require("cors")
const alunasRotas = require("./routes/alunaRotas")
const app = express()

app.use(express.json())
app.use(cors())

//rota inicial da api
app.get("/" , (req,res) =>{
    res.status(200).send("API ONNN")
})

app.use("/alunas", alunasRotas)

module.exports = app