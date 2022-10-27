const db = require("../database/db")

const crypto = require("crypto")

const obterTodasAsAlunas = async (req, res) =>{
    try {
        const alunas = await db()

        const{nome, cidade, bairro, mae, pai} = req.query

        let alunasFiltradas = alunas.slice()

        if(nome){
            alunasFiltradas = alunasFiltradas.filter(alunaAtual =>{
                const nome_registro = alunaAtual.nome_registro.toLowerCase()

                let nome_social = alunaAtual.nome_social

                if(nome_social) {
                    nome_social = nome_social.toLowerCase()
                    return nome_social.includes(nome) || nome_registro.includes(nome)
                }
                return  nome_registro.includes(nome)
            })
        }

        if (cidade) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                return alunaAtual.cidade.toLowerCase() == cidade.toLowerCase()
            })
        }

        if (bairro) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => alunaAtual.bairro.toLowerCase() == bairro.toLowerCase())
        }

        if(mae) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                return alunaAtual.mae.toLowerCase().includes(mae.toLowerCase())
            })
        }

        if(pai) {
            alunasFiltradas = alunasFiltradas.filter(alunaAtual => {
                return alunaAtual.pai.toLowerCase().includes(pai.toLowerCase())
            })
        }


        res.status(200).send(alunasFiltradas)
    } catch (error) {
        res.status(500).send({
            message: error.messase
        })
    }
}

const obterAlunaPorId = async (req, res) =>{
    const {id} = req.params

    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna => aluna.id == id)
        if (alunaEncontrada == undefined) {
            return res.status(400).send({message: "Aluna não encontrada"})
        }
        res.status(200).send(alunaEncontrada)
    } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const obterNotas = async (req, res) =>{
    const { id } = req.params

    try {
        const alunas = await db()

        const alunaEncontrada = alunas.find(alunaAtual => alunaAtual.id == id)

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
        res.status(200).send(resposta)

        } catch (error) {
        res.status(500).send({message: error.message})
    }
}

const obterBoletim = async (req, res) => {

}

const criarAluna = async (req, res) => {
    try {
        const alunas = await db()

        const alunaBody = req.body
        const {rg, cpf, email, nome_registro} = alunaBody

        if (rg == undefined) return res.status(400).send({
            message: "Rg é obrigatório"
        })
        if (cpf == undefined) return res.status(400).send({
            message: "Cpf é obrigatório"
        })
        if (email == undefined || email.includes("@") == false){
            return res.status(400).send({
                messase: "email obrigatório" 
            })
        }
        if (nome_registro == undefined) return res.status(400).send({
            message: "O nome do registro é obrigatório"
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
    const { id } = req.params
    const {
        cpf, id: idDeletado, // extraimos (remover) o cpf e o id do body
        ...alunaBody} = req.body //agrupou todo o resto, sem o id e o cpf
    
    // achar a aluna
    // atualizar os dados dela que vem do body
    // retorna a reposta para o servidor
    
    try {
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna => aluna.id == id)
        
        if (alunaEncontrada == undefined) return res.status(404).send({
            message: "Aluna não encontrada."
        })

        const chaves = Object.keys(alunaEncontrada)

        // n pode atualizar cpf da aluna
        // não pode atualizar o id

        if(cpf){
            throw new Error("O cpf não pode ser atualizado")
        }

        chaves.forEach(chave =>{
            let dadoAtualizado = alunaBody[chave] // acessa a propriedade(valor) que vem do body
            let existeDado = new Boolean(dadoAtualizado) // valida se existe um dado
            console.log(existeDado) //meu teste o da prof n tem esse
            if(existeDado == true) alunaEncontrada[chave] = dadoAtualizado // atualiza o dado
        })

        res.status(200).send(alunaEncontrada)
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const deletarAluna = async (req, res) => {
    // um meio de deletar
    // encontrar ela
    const {id} = req.params

    try {
        const alunas = await db()
        const alunaIndice = alunas.findIndex(aluna => aluna.id == id)
        //const indice = alunas.indexOf(alunaEncontrada) mudou para essa forma na linha acima
       
        if(alunaIndice === -1) return res.status(404).send({
            message:"Aluna não encontrada"
        })

        alunas.splice(alunaIndice, 1)

        res.status(200).send({message: "Aluna deletada com sucesso!"})

    } catch (error) {
        res.status(500).send({message: error.message})
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