const db = require("../database/db")

const obterTodasAsAlunas = async (req, res) => {
   try {
     const alunas = await db()

     const { nome, cidade, bairro, pai, mae } = req.query 

     let alunasFiltradas = alunas.slice()
  
     if (nome) {
        alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
            const nome_registro = alunaAtual.nome_registro.toLowerCase()
            
            let nome_social = alunaAtual.nome_social

            if (nome_social)  { 
              nome_social = nome_social.toLowerCase()
              return nome_social.includes(nome) || nome_registro.includes(nome)
            }
            return  nome_registro.includes(nome) 
        })
     }

     if (cidade) {
       alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
          return alunaAtual.cidade == cidade
       })
     }

     if (bairro) {
       alunasFiltradas = alunasFiltradas
       .filter(alunaAtual => alunaAtual.bairro == bairro)
     }

     if (mae) {
      alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
        return alunaAtual.mae.toLowerCase().includes(mae.toLowerCase())
      })
     }

     if (pai) {
      alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
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

const obterAlunaPorId = async (req, res) => {

}

const obterNotas = async (req, res) => {

}

const obterBoletim = async (req, res) => {

}

const criarAluna = async (req, res) => {

}

const atualizarAluna = async (req, res) => {

}

const deletarAluna = async (req, res) => {

}

module.exports = {
  deletarAluna,
  criarAluna,
  atualizarAluna,
  obterTodasAsAlunas,
  obterAlunaPorId,
  obterNotas,
  obterBoletim
}