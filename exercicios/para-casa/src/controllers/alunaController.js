const db = require("../database/db")
const crypto = require("crypto")

const obterTodasAsAlunas = async (request, response) => {
    try {
      const alunas = await db()

      const { nome, cidade, bairro, mae, pai } = request.query 

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
            return alunaAtual.cidade.toLowerCase() == cidade
        })
      }


      if (bairro) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
            return alunaAtual.bairro.toLowerCase() == bairro
        })
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

       response.status(200).send(alunasFiltradas)
    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const obterAlunaPorId = async (request, response) => {

}

const obterNotas = async (request, response) => {
    const { id } = request.params

    try {
    const alunas = await db()

    const alunaEncontrada = alunas.find(alunaAtual => {
        return alunaAtual.id == id
    })

    const notas = alunaEncontrada.notas
    const {
        ciencias_da_natureza, ciencias_humanas, linguagens_codigos, matematica, redacao, turma
    } = notas

    const resposta =  {
        ciencias_da_natureza,
        ciencias_humanas,
        linguagens_codigos,
        matematica,
        redacao, 
        turma: alunaEncontrada.turma,
        nome: alunaEncontrada.nome_social || alunaEncontrada.nome_registro
    }

    response.status(200).send(resposta)
    } catch (error) {
    response.status(500).send({ message: error.message })
    }
}

const obterBoletim = async (request, response) => {
    try {
    const { turma } = request.params
    const alunas = await db()
    let alunasFiltradas = []

    const alunasEncontradas = alunas.filter(alunaAtual => {
        return alunaAtual.turma == turma
    })

    if(alunasEncontradas.length == 0) {
        return response.status(404).json( {message: `A turma ${turma} não existe`})
    }

    alunasEncontradas.forEach(aluna => {
        boletimAlunas = Object.values(aluna.notas)

        media = boletimAlunas.reduce((acumulator, nota) => Number(acumulator) + Number(nota)) / 5

        if(media >= 6) {
            situacao = "APROVADA"
        } else if (media >=5) {
            situacao = "RECUPERACAO"
        } else {
            situacao = "REPROVADA"
        }

        const { ciencias_da_natureza, ciencias_humanas, linguagens_codigos, matematica, redacao } = aluna.notas

        const resposta =  {
            nome: aluna.nome_social || aluna.nome_registro,
            turma: aluna.turma,
            boletim: aluna.notas,
            media: Number(media.toFixed(2)),
            situacao: situacao
        }
        alunasFiltradas.push(resposta)
    });

    response.status(200).send(alunasFiltradas)
    } catch (error) {
    response.status(500).send({ message: error.message })
    }
}

const criarAluna = async (request, response) => {
    try {
        const alunas = await db()

        const alunaBody = request.body
        const { rg, cpf, email, nome_registro } = alunaBody

        if(rg == undefined) return response.status(400).send({
            message: "O RG é obrigatório"
        })

        if(cpf == undefined) return response.status(400).send({
            message: "O CPF é obrigatório"
        })

        if(email == undefined || email.includes("@") == false) {
            return response.status(400).send({
                message: "O e-mail é obrigatório"
            })
        }

        if(nome_registro == undefined) return response.status(400).send({
            message: "O nome de registro é obrigatório"
        })

        alunaBody.id = crypto.randomUUID()
        alunas.push(alunaBody)

        response.status(201).send(alunaBody)
    } catch (error) {
        response.status(500).send({ message: error.message })
    }
}

const atualizarAluna = async (req, res) => {
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

const deletarAluna = async (req, res) => {
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
    obterTodasAsAlunas,
    obterAlunaPorId,
    obterNotas,
    obterBoletim,
    criarAluna,
    atualizarAluna,
    deletarAluna
}