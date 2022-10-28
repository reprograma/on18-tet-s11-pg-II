const db = require("../database/db")

const crypto = require("crypto")

const obterTodasAsAlunas = async (req, res) => {
   try {
     const alunas = await db()

     const { nome, cidade, bairro, pai, mae } = req.query 

     let alunasFiltradas = alunas.slice()
  
     if (nome) {
        alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
            const nomeRegistro = alunaAtual.nomeRegistro.toLowerCase()
            
            let nomeSocial = alunaAtual.nome_social

            if (nomeSocial)  { 
              nomeSocial = nomeSocial.toLowerCase()
              return nomeSocial.includes(nome) || nomeRegistro.includes(nome)
            }
            return  nomeRegistro.includes(nome) 
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
  const { id } = req.params

  try {
      const alunas = await db()
      const alunaEncontrada = aluna.find(aluna => aluna.id == id)

      if (alunaEncontrada == undefined){
          return res.status(404).send({message: `Aluna com ${id} não foi encontrada`})
      }
      res.status(200).send(alunaEncontrada)
  } catch (error) {
      res.status(500).send({message: error.message})
  }
}

const obterNotas = async (req, res) => {
  const { id } = req.params

  try {
    const alunas = await db()
  
    const alunaEncontrada = alunas
    .find(alunaAtual => alunaAtual.id == id)

    const notas = alunaEncontrada.notas
    const { 
      ciencias_da_natureza, ciencias_humanas, linguagens_codigos,
      matematica, redacao
     } = notas

    const resposta = {
      ciencias_da_natureza,
      ciencias_humanas,
      linguagens_codigos,
      matematica,
      redacao,
      turma: alunaEncontrada.turma,
      nome: alunaEncontrada.nome_social || alunaEncontrada.nome_registro,
    }

    res.status(200).send(resposta)

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const obterBoletim = async (req, res) => {
  const alunas = await db();
  const { turma } = req.params
  boletim = []

  try {
      const alunasEncontradas = alunas.filter(alunaAtual => alunaAtual.turma == turma)

      if (alunasEncontradas.length == 0) return res.status(404).json({ 
        message: `Não encontramos nenhuma turma com o id: ${turma}.` 
      })
      
      alunasEncontradas.forEach(aluna => {
          const { 
            ciencias_da_natureza, 
            ciencias_humanas, 
            linguagens_codigos,
            matematica,
            redacao 
          } = aluna.notas

          let situacao;

          const media = (
            parseFloat(ciencias_da_natureza) + 
            parseFloat(ciencias_humanas) + 
            parseFloat(linguagens_codigos) + 
            parseFloat(redacao) + 
            parseFloat(matematica)
          ) / 5;

          if (media >= 6) {
            situacao = "APROVADA"
          }else if(media < 6 && media >= 5) {
            situacao = "RECUPERACAO"
          }else {
            situacao = "REPROVADA"
          }

          let descricao = {
            "aluna": aluna.nome_social || aluna.nome_registro,
            "boletim": aluna.notas,
            "media_final": media,
            "situação": situacao
          }

          boletim.push(descricao)
      })

      res.status(200).send(boletim)
  } catch(error) {
      res.status(500).send({message: error.message})
  }
}

const criarAluna = async (req, res) => {
   try {
     const alunas = await db()

     const alunaBody = req.body
     const { rg, cpf, email, nome_registro } = alunaBody
    
     if (rg == undefined) return res.status(400).send({
      message: "Rg é obrigario"
     })
     if (cpf == undefined) return res.status(400).send({
      message: "Cpf é obrigatorio"
     }) 
     if (email == undefined || email.includes("@") == false) {
      return res.status(400).send({
        message: "email obrigario"
       })
     }
     if (nome_registro == undefined) return res.status(400).send({
       message: "O nome de registro é obrigario"
     })

     alunaBody.id = crypto.randomUUID()

     alunas.push(alunaBody)

     res.status(201).send(alunaBody)
   } catch (error) {
     res.status(500).send({
      message: error.message
     })
   }
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