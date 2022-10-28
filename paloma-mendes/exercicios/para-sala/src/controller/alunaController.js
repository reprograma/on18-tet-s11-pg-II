const db = require("../database/db")
const crypto = require("crypto")

const obterTodasAsAlunas = async (request, response) => {

    try {
        const alunas = await db()

        const { nome, cidade, bairro, mae, pai } = request.query

        //criando uma cópia do array de alunas
        let alunasFiltradas = alunas.slice()

        if (nome) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                const nome_registro = alunaAtual.nome_registro.toLowerCase()

                let nome_social = alunaAtual.nome_social

                if (nome_social) {
                    nome_social = nome_social.toLowerCase()
                    return nome_social.includes(nome) || nome_registro.includes(nome)
                }
                return nome_registro.includes(nome)
            })
        }

        if (cidade) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                const cidadeEncontrada = alunaAtual.cidade.toLowerCase()

                return cidadeEncontrada.includes(cidade)
            })
        }

        if (bairro) {
            // alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
            //     const bairroEncontrado = alunaAtual.bairro.toLowerCase()

            //     return bairroEncontrado.includes(bairro)
            // })
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                return alunaAtual.bairro.toLowerCase().includes(bairro.toLowerCase())
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
    try {
        const alunas = await db()
        const idRequest = request.params.id

        let alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == idRequest)

        if (alunaEncontrada === undefined) return response.status(500).send({
            message: `Nenhuma aluna encontrada para o ID informado: ${idRequest}`
        })

        response.status(200).send(alunaEncontrada)

    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }

}

const obterNotas = async (request, response) => {
    try {
        const alunas = await db()
        const { id } = request.params

        const alunaEncontrada = alunas.find
            (alunaAtual => alunaAtual.id == id)

        const notas = alunaEncontrada.notas
        const {
            ciencias_da_natureza, ciencias_humanas, linguagens_codigos, matematica, redacao
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

        response.status(200).send(resposta)
    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const obterBoletim = async (request, response) => {

    try {
        const alunas = await db()
        const { turma } = request.params

        // let alunasEncontradas = alunas.slice()

        const alunasEncontradas = alunas.filter(turmaAtual => turmaAtual.turma == turma)

        if (alunasEncontradas == 0) return response.status(400).send({ message: "Nenhuma aluna encontrada para a turma informada" })

        let alunasPorTurma = [];

        alunasEncontradas.forEach(alunaAtual => {
            let situacao = 0
            notas = Object.values(alunaAtual.notas)

            media = (notas.reduce((acumulador, nota) => Number(acumulador) + Number(nota))) / 5

            if (media >= 6) {
                situacao = "APROVADA"
            } if (media > 5 && media < 6) {
                situacao = "RECUPERAÇÂO"
            } else {
                situacao = "REPROVADO"
            }

            const resposta = {
                ciencias_da_natureza: alunaAtual.notas.ciencias_da_natureza,
                ciencias_humanas: alunaAtual.notas.ciencias_humanas,
                linguagens_codigos: alunaAtual.notas.linguagens_codigos,
                matematica: alunaAtual.notas.matematica,
                redacao: alunaAtual.notas.redacao,
                turma: alunaAtual.turma,
                nome: alunaAtual.nome_social || alunaAtual.nome_registro,
                media: situacao
            }

            alunasPorTurma.push(resposta)
        })
        response.status(200).send(alunasPorTurma)

    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const criarAluna = async (request, response) => {
    try {
        const alunas = await db()
        const alunaBody = request.body
        const { rg, cpf, email, nome_registro } = alunaBody

        if (rg === undefined) return response.status(400).send({ message: "RG é obrigatório" })

        if (cpf === undefined) return response.status(400).send({ message: "CPF é obrigatório" })

        if (email == undefined || email.includes("@") == false) {
            return response.status(400).send({ message: "Email é obrigatório" })
        }

        if (nome_registro === undefined) return response.status(400).send({ message: "O nome de registro é obrigatório" })

        alunaBody.id = crypto.randomUUID()

        alunas.push(alunaBody)

        response.status(201).send(alunaBody)

    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const atualizarAluna = async (request, response) => {
    alunas = await db()
    const { idRequest } = request.params
    const alunaBody = request.body

    const alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == idRequest)

    const chaves = Object.keys(alunaEncontrada)

    chaves.forEach(chave => {


    })

    try {

    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const deletarAluna = async (request, response) => {
    try {
        
    } catch (error) {
        
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