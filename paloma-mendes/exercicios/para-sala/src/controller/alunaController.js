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

        if (alunaEncontrada === undefined) return response.status(404).send({
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
    //Melhor solução, feito em aula
    const turmaRequest = request.params.turma

    try {
        const alunas = await db()
        const alunasFiltradas = alunas.filter(alunaAtual => alunaAtual.turma == turmaRequest)

        if (alunasFiltradas.length == 0) {
            return response.status(404).send({
                message: "Essa turma não existe: " + turmaRequest,
            })
        }

        //mapeando os dados
        const alunasBoletim = alunasFiltradas.map((aluna) => {
            const notas = Object
                .values(aluna.notas) //pegar todas a notas
                .map(nota => Number(nota)) //convertendo as notas para numeros

            //soma das notas utilizando o reduce
            //reduce array.reduce((acumulador, valorAtual) => acumulador + valorAtual, ValorEmQue inicia)
            const total = notas.reduce((total, nota) => total + nota, 0)
            const media = total / notas.length

            let situacao = "NÃO COMPUTADA"

            if (media > 6) situacao = "APROVADA"
            else if (media < 5) situacao = "REPROVADA"
            else if (media >= 5 && media <= 6) situacao = "RECUPERAÇÃO"

            const boletim = {
                nome: aluna.nome_social || aluna.nome_registro,
                turma: aluna.turma,
                ...aluna.notas, // é o equivalente a extrair nota por nota
                media,
                situacao,
            }

            return boletim
        })

        response.status(200).send(alunasBoletim)
    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

  //Solução que fiz inicialmente  // try {
    //     const alunas = await db()
    //     const { turma } = request.params

    //     // let alunasEncontradas = alunas.slice()

    //     const alunasEncontradas = alunas.filter(turmaAtual => turmaAtual.turma == turma)

    //     if (alunasEncontradas == 0) return response.status(400).send({ message: "Nenhuma aluna encontrada para a turma informada" })

    //     let alunasPorTurma = [];

    //     alunasEncontradas.forEach(alunaAtual => {
    //         let situacao = 0
    //         notas = Object.values(alunaAtual.notas)

    //         media = (notas.reduce((acumulador, nota) => Number(acumulador) + Number(nota))) / 5

    //         if (media >= 6) {
    //             situacao = "APROVADA"
    //         } if (media > 5 && media < 6) {
    //             situacao = "RECUPERAÇÂO"
    //         } else {
    //             situacao = "REPROVADO"
    //         }

    //         const resposta = {
    //             ciencias_da_natureza: alunaAtual.notas.ciencias_da_natureza,
    //             ciencias_humanas: alunaAtual.notas.ciencias_humanas,
    //             linguagens_codigos: alunaAtual.notas.linguagens_codigos,
    //             matematica: alunaAtual.notas.matematica,
    //             redacao: alunaAtual.notas.redacao,
    //             turma: alunaAtual.turma,
    //             nome: alunaAtual.nome_social || alunaAtual.nome_registro,
    //             media: situacao
    //         }

    //         alunasPorTurma.push(resposta)
    //     })
    //     response.status(200).send(alunasPorTurma)

    // } catch (error) {
    //     response.status(500).send({
    //         message: error.message
    //     })
    // }
// }

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
    const idRequest = request.params.id
    const { cpf, id: idDeletado, // extraimos(removemos) o cpf e o id do body
        ...alunaBody } = request.body
    // outra forma de deletar: delete: alunaBody.cpf; delete alunaBody.id

    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == idRequest)

        if (alunaEncontrada == undefined) return response.status(404).send({
            message: "Aluna não encontrada"
        })

        const chaves = Object.keys(alunaEncontrada)

        if (cpf) {
            throw new Error("O CPF não pode ser atualizado")
        }

        chaves.forEach(chave => {
            let dadoAtualizado = alunaBody[chave] //acessando a propriedade que vem do body(request) e atribuindo a let 
            if (dadoAtualizado) alunaEncontrada[chave] = dadoAtualizado
            // let existeDado = new Boolean(dadoAtualizado) //valida se recebemos o dado na request
            // if (existeDado === true) alunaEncontrada[chave] = dadoAtualizado //atualiza o dado recebido de acordo com a sua respectiva chave
        })

        response.status(200).send(alunaEncontrada)

    } catch (error) {
        response.status(500).send({
            message: error.message
        })
    }
}

const deletarAluna = async (request, response) => {
    // const idRequest = request.params.id
    const { id } = request.params

    try {
        const alunas = await db()
        const alunaIndice = alunas.findIndex(alunaAtual => alunaAtual.id == id)

        if (alunaIndice == -1) return response.status(404).send({
            message: "Aluna não encontrada"
        })

        alunas.splice(alunaIndice, 1)

        response.status(200).send({
            message: "Aluna deletada com sucesso!"
        })

    } catch (error) {
        response.status(500).send({ message: error.message })
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