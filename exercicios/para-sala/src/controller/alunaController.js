const db = require("../database/db")
const crypto = require("crypto")

const obterTodasAsAlunas = async (req,res)=>{
try {
    const alunas = await db()
    const { nome, cidade, estado, mae,pai } = req.query
    let alunasFiltradas = alunas.slice()

    if (nome){
        alunasFiltradas=alunasFiltradas.filter(alunaAtual =>{
            const nome_registro = alunaAtual.nome_registro.toLowerCase()
            let nome_social = alunaAtual.nome_social
            if (nome_social) { //tem nome social?
                nome_social = nome_social.toLowerCase()
                return nome_social.includes(nome)||nome_registro.includes(nome)
                }
                return nome_registro.includes(nome)//else
            })
        }
        if (cidade){
            alunasFiltradas=alunasFiltradas.filter(alunaAtual=>{
                return alunaAtual.cidade ==cidade
            })
        }
        if (bairro){
            alunasFiltradas=alunasFiltradas.filter(alunaAtual=>alunaAtual.bairro==bairro)
        }
        if (mae){
            alunasFiltradas=alunasFiltradas.filter(alunaAtual=>{
                return alunaAtual.mae.toLowerCase().includes(mae.toLowerCase())
            })
        }
        if (pai){
            alunasFiltradas=alunasFiltradas.filter(alunaAtual=>{
                return alunaAtual.pai.toLowerCase().includes(pai.toLowerCase())
            })
        }
    res.status(200).send(alunasFiltradas)
} catch (error) {
    res.status(500).send({
        message: error.message
    })
    
}
}

const obterAlunaPorId = async (req,res)=>{
    const {id} = req.params
    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna => aluna.id == id)
        if (alunaEncontrada == undefined) {
            return res.status(404).send({message: "Aluna não encontrada"})
        }
        res.status(200).send(alunaEncontrada)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const obterNotas = async(req,res)=>{
    const { id } = req.params
    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(alunaAtual=>alunaAtual.id==id)
        const notas = alunaEncontrada.notas
        const {
             ciencias_da_natureza,ciencias_humanas,linguagens_codigos,
             matematica, redacao
            } = notas
        const resposta = {
            ciencias_da_natureza,
            ciencias_humanas,
            linguagens_codigos,
            matematica,
            redacao,
            turma: alunaEncontrada.turma
        }
        res.status(200).send(resposta)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const criarAluna = async(req,res)=>{
    try {
        const alunas = await db()
        const alunaBody = req.body
        const { rg, cpf, email, nome_registro}=alunaBody
        if (rg==undefined) return res.status(400).send({message: "RG é obrigatório"})
        if (cpf==undefined) return res.status(400).send({message: "CPF é obrigatório"})
        if (email==undefined||email.includes("@")==false) return res.status(400).send({message: "e-mail é obrigatório"})
        if (nome_registro==undefined) return res.status(400).send({message: "Nome de registro é obrigatório"})
        alunaBody.id=crypto.randomUUID()
        alunas.push(alunaBody)

        res.status(201).send(alunaBody)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const obterBoletim = async(req,res)=>{
    try {
        const alunas=await db()
        const { turma } = req.params
        const alunasTurma = alunas.find(aluna => aluna.turma == turma)
        const {
            ciencias_da_natureza,ciencias_humanas,linguagens_codigos,
            matematica, redacao
           } = notas
           const boletimFinal = {}
        for (const index in alunasTurma){
            let mediaAluna = (alunasTurma[index].ciencias_da_natureza.parseFloat()+alunasTurma[index].ciencias_humanas.parseFloat()+alunasTurma[index].linguagens_codigos.parseFloat()+alunasTurma[index].matematica.parseFloat()+alunasTurma[index].redacao.parseFloat())/5
            if (mediaAluna>6) {situacaoAluna = "APROVADA";}
            else if (mediaAluna>5 || mediaAluna<=6) {situacaoAluna = "RECUPERAÇÃO";}
            else {situacaoAluna = "REPROVADA";}
            const resposta = {
                nome: alunasTurma[index].nome_registro,
                turma,
                media: mediaAluna,
                situacao: situacaoAluna,
                ciencias_da_natureza,
                ciencias_humanas,
                linguagens_codigos,
                matematica,
                redacao,
                turma: alunasTurma[index].turma
            }
            boletimFinal.push(resposta)
        }
        console.log(turma)
        res.status(200).send(boletimFinal)
    } catch (error) {
        res.status(404).send({
            message: error.message
        })
    }
}

const deletarAluna = async(req,res)=>{
    const {id}=req.params
    try {
        const alunas = await db()
        const alunaIndice = alunas.findIndex(aluna => aluna.id == id)
        if (alunaIndice == -1) return res.status(404).send({
            message: "Aluna Não Encontrada"
        })
        alunas.splice(alunaIndice,1)

        res.status(200).send({message: "Aluna deletada com sucesso"})
    } catch (error) {
        res.status(500).send ({message: error.message})
    }
}
const atualizarAluna = async(req,res)=>{
    const { id } = req.params
    const {cpf, id:idDeletado, ...alunaBody} = req.body
    //delete alunaBody.cpf alunaBody.id
    //achar a aluna
    //atualizar os dados que vem do body
    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna => aluna.id == id)
        if (alunaEncontrada == undefined) return res.status(404).send({
            message: "Aluna não Encontrada."
        })
        const chaves = Object.keys(alunaEncontrada)
        
        if (cpf){
            throw new Error ("O CPF não pode ser atualizado")
        }
        chaves.forEach(chave =>{
            let dadoAtualizado = alunaBody[chave]
            let existeDado = new Boolean(dadoAtualizado)
            if (existeDado == true) alunaEncontrada[chave] = dadoAtualizado
        })
        res.status(200).send(alunaEncontrada)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}


module.exports={
    obterTodasAsAlunas,
    obterAlunaPorId,
    obterNotas,
    criarAluna,
    atualizarAluna,
    obterBoletim,
    deletarAluna
}