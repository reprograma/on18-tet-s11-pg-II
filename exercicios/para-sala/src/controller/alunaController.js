const db = require("../database/db")

const crypto = require("crypto")
const { response } = require("../app")

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
 const { ids } = req.params
 try {
    const alunas = await db()
    let alunasEncontradasPorId = alunas.find(aluna => aluna.id == ids)
    if(alunasEncontradasPorId == undefined){
      return res.status(404).send({ message: "Aluna não encontrada"})
    }
    
    res.status(200).send(alunasEncontradasPorId)
 } catch (error) {
    res.status(500).send({ message: error.message})
 }

   const { id } = req.params

   try {
      const alunas = await db()
      const alunaEncontrada = alunas.find(aluna => aluna.id  == id)
      if (alunaEncontrada == undefined) {
        return res.status(404).send({ message: "Aluna não encontrada"})
      }
      res.status(200).send(alunaEncontrada)
   } catch (error) {
    res.status(500).send({ message: error.message })
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
      nome: alunaEncontrada.nome_social || alunaEncontrada.nome_registro
    }

    res.status(200).send(resposta)

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const obterBoletim = async (req, res) => {
  
  const alunas = await db();
    const {turma} = req.params
    resultado = []

    try{
        const alunasEncontradas = alunas.filter((alunaAtual)=> alunaAtual.turma == turma)

        alunasEncontradas.forEach(aluna => {

            const {ciencias_da_natureza, ciencias_humanas, linguagens_codigos,matematica,redacao} = aluna.notas

            let situacao;

            const media = 
            (Number(ciencias_da_natureza) + 
            Number(ciencias_humanas) + 
            Number(linguagens_codigos) + 
            Number(redacao) + 
            Number(matematica)) 
            / 5;

            if (media >=6){
                situacao = "Aprovada"
            }else if(media < 6 && media >= 5){
                situacao = "Recuperação"
            }else{
                situacao = "Reprovada"
            }

            let descricao = {
                "aluna": aluna.nome_social || aluna.nome_registro,
                "boletim": aluna.notas,
                "Média final": media,
                "Situação": situacao
            }

            resultado.push(descricao)
        })

        res.status(200).send(resultado)
    }catch(error){
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
  try{
    const alunas = await db()
    const alunasEncontrada = alunas.find(aluna => aluna.id == id)
    
    if (alunasEncontrada == undefined) return res.status(404).send({
      message:"Alunas não encontradas"
    })
    
    const chaves = Object.keys(alunasEncontrada)
    
    if(cpf){
      throw new Error("o cpf não pode se atualizado")
    }
    
    chaves.forEach(chave => {
      let dadoAtualizado = alunaBody [chaves]
      let existeDado = new Boolean(dadoAtualizado)
      if(existeDado ==  true) alunasEncontrada[chave]
    })
    
    res.status(200).send(alunasEncontrada)
    } catch(Error) {
      res.status(500).send({message: error.message })
    }
}

const deletarAluna = async (req, res) => {
  const { ids } = req.params

  try{
    const alunas = await db()
    const alunaIndice = alunas.findIndex(aluna => aluna.id == ids)
    if (alunaIndice === -1) return res.status(404).send({
      message: "Aluna não encontrada"
    })

    alunas.splice(alunaIndice, 1)

    res.status(200).send({ message: "Aluna deletada com sucesso"})
  } catch (Error){
    res.status(500).send({message:Error.message})
  }
   const { id } = req.params
   // 
   const {
   cpf, id: idDeletado, // extraimos(remover) o cpf e o id do body
    ...alunaBody // agrupou todo o resto, sem o id e o cpf
  } = req.body
   // delete alunaBody.cpf; delete alunaBody.id
   try {
      const alunas = await db()
      const alunaEncontrada = alunas.find(aluna => aluna.id == id)
      
      if (alunaEncontrada == undefined) return res.status(404).send({
        message: "Aluna não encontrada."
      })

      const chaves = Object.keys(alunaEncontrada)

      if (cpf) {
        throw new Error("O Cpf não pode ser atualizado.")
      }
   
      chaves.forEach(chave => {
        let dadoAtualizado = alunaBody[chave] // acessa a propriedade(valor) que vem body
        let existeDado = new Boolean(dadoAtualizado) // valida se existe um dado
        if (existeDado == true) alunaEncontrada[chave] = dadoAtualizado // atualiza o dado
      })

      res.status(200).send(alunaEncontrada)
   } catch (error) {
     res.status(500).send({
      message: error.message
     })
   }
}

const deletarAlunas = async (req, res) => {
   const { id } = req.params

   try {
     const alunas = await db()
     const alunaIndice = alunas.findIndex(aluna => aluna.id == id)
     
     if (alunaIndice === -1) return res.status(404).send({
       message: "Aluna não encontrada."
     })
    
     alunas.splice(alunaIndice, 1)

     res.status(200).send({ message: "Aluna deletada com sucesso!"})
     
   } catch (error) {
      res.status(500).send({ message: error.message })
   }
}


module.exports = {
  deletarAlunas,
  criarAluna,
  atualizarAluna,
  obterTodasAsAlunas,
  obterAlunaPorId,
  obterNotas,
  obterBoletim
}