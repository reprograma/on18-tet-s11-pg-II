const { response } = require("express")

const db = require("../database/db") //IMPORTAR BANCO DE DADOS

const crypto = require("crypto")

const obterTodasAsAlunas = async (req, res) => {
    try {
        const alunas = await db()
        const { nome, cidade, bairro, mae, pai } = req.query //query é consulta

        let alunasEncontradas = alunas.slice()

        if (nome) {
            alunasEncontradas = alunasEncontradas.filter(alunaAtual =>{
                const nome_registro = alunaAtual.nome_registro.toLowerCase()
                
                let nome_social = alunaAtual.nome_social
    
                if (nome_social)  {
                  nome_social = nome_social.toLowerCase()
                  return nome_social.includes(nome) || nome_registro.includes(nome)
                  //se tem nome social retorna aqui
                }
                //se não tem nome social retorna aqui
                return nome_registro.includes(nome)
            })
         }

         if(cidade) {
            alunasEncontradas = alunasEncontradas.filter(alunaAtual => {
                return alunaAtual.cidade == cidade
            })
         }
         if (bairro) {
            alunasEncontradas = alunasEncontradas.filter(alunaAtual => alunaAtual.bairro == bairro)
         }
         if (mae) {
            alunasEncontradas = alunasEncontradas.filter(alunaAtual => {
                return alunaAtual.mae.toLowerCase().includes(mae.toLowerCase())
         })
        }
        if (pai) {
            alunasEncontradas = alunasEncontradas.filter(alunaAtual => {
                return alunaAtual.pai.toLowerCase().includes(pai.toLowerCase())
            })
        }
    
        res.status(200).send(alunasEncontradas)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}
const ObterAlunaPorId = async (req, res) => {
    const { id } = req.params
    const alunas = await db()

    const alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == id)

    if (!alunaEncontrada) return response.status(404).send({
        message: `Nenhuma aluna encontrada para esse id ${id}`
    })

    res.status(200).send(alunaEncontrada)
}

const obterNotas = async (req, res) => {
      const { id } = req.params
    try { 
        const alunas = await db()
        const alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == id)

        const notas = alunaEncontrada.notas 
        const {
            ciencias_da_natureza, ciencias_humanas,linguagem_codigos, matematica, redacao
        } = notas

        const resposta = {
            ciencias_da_natureza,
            ciencias_humanas,
            linguagem_codigos,
            matematica,
            redacao,
            turma: alunaEncontrada.turma,
            nome: alunaEncontrada.nome_social || alunaEncontrada.nome_registro
        }

        res.status(200).send(resposta)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}
// PARA CASA 
const boletim = async (req, res) => {
    const { turma } = req.params
  try {
    const alunas = await db()

    const alunasEncontradas = alunas.filter(alunaAtual => alunaAtual.turma == turma)

    let notasAlunas;
    let media;
    let alunasFiltradas = [];

    alunasEncontradas.forEach(aluna => {
      notasAlunas = Object.values(aluna.notas)
      media = (notasAlunas.reduce((acumulador, nota) => Number(acumulador) + Number(nota))) / 5

      if (media > 6) {
        situacao = "APROVADA"
      } else if (media > 5) {
        situacao = "RECUPERAÇÃO"
      } else {
        situacao = "REPROVADA"
      }
      const resposta = {
        ciencias_da_natureza: aluna.notas.ciencias_da_natureza,
        ciencias_humanas: aluna.notas.ciencias_humanas,
        linguagens_codigos: aluna.notas.linguagens_codigos,
        matematica: aluna.notas.matematica,
        redacao: aluna.notas.redacao,
        situacao: situacao,
        media: media,
        nome: aluna.nome_social || aluna.nome_registro,
        turma: aluna.turma
      }
      alunasFiltradas.push(resposta)
    });

    res.status(200).send(alunasFiltradas)

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

const criarAluna = async (req, res) => {
    try {
        const alunas = await db()

        const alunaBory = req.body
        const { rg, cpf, email, nome_registro } = alunaBory

        if (rg == undefined) return res.status(400).send({
            message: "Rg é obrigatório"
        })
        if(cpf == undefined) return res.status(400).send({
            message: "CPF é obrigatório"})

        if(email == undefined || email.includes("@") == false) {
            return res.status(400).send({
                message: "E-mail é obrigatório"})
            }
        if(nome_registro == undefined) return res.status(400).send({
            message: "O nome de registro é obrigatório"})

        alunaBory.id = crypto.randomUUID()
        alunas.push(alunaBory)

        res.status(201).send(alunaBory)
    } catch(error) {
        res.status(500).send({
            message: error.message
        })

    }
}

const atualizarAluna = async (req, res) => {
    const { id } =  req.params
    const { cpf, id: idDeletado, ...alunaBory } = req.body
    //delete alunaBory.cpf; delete alunaBory.id

    //achar aluna
    //atualizar os dados que vem do body
    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna => aluna.id == id)
        const chaves = Object.keys(alunaEncontrada)

        if(cpf) {
            throw new Error("O CPF não pode ser atualizado")
        }
        chaves.forEach(chave => {
            let dadoAtualizado = alunaBody[chave]
            if (dadoAtualizado) alunaEncontrada[chave] = dadoAtualizado
              })

        res.status(200).send(alunaEncontrada)
    } catch (error) {
        res.status(500).send({
            message: error.message})     
     }
}

const deletarAluna = async (req, res) => {}

module.exports = {
    obterTodasAsAlunas,
    ObterAlunaPorId,
    obterNotas,
    boletim,
    criarAluna,
    atualizarAluna,
    deletarAluna
}