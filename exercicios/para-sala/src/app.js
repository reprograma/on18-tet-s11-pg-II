const express = require("express")
const cors = require("cors")
const alunasRotas = require("./routes/alunaRotas")
const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) =>{
    res.status(200).send("API TA ON")
})

app.use("/alunas", alunasRotas)

module.exports = app 