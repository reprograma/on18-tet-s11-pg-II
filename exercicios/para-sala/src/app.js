const express = require("express")
const cors = require("cors")
const alunaRotas = require("./routes/alunaRotas")
const app = express()

app.use(express.json())

app.use(cors())

app.get("/",(req,res)=>{
    res.status(200).send("API ON")
})

app.use("/alunas",alunaRotas)

module.exports = app;