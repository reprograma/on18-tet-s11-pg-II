const express=require('express')
const app=express()
const cors=require('cors')
const rotas=require('./src/routes/alunaRotas')

app.use(express.json())
app.use(cors())


app.get('/', (req,res)=>{
    res.status(200).send('api funcionando')
})

app.use('/alunas', rotas)

module.exports=app;