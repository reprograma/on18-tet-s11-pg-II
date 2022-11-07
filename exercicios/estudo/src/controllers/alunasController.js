
const db = require ("../database/db")

const crypto = require("crypto")
// crypto é um dependencia de segurança do node. Cria criptografia etc

const obterTodasAsAlunas = async (request, response) => {

    try {
        const alunas = await db()

        const { nome, cidade, bairro, pai, mae } = request.query

        let alunasFiltradas = alunas.slice()

        if(nome) {
            
            alunasFiltradas = alunasFiltradas.filter(aluna => {
            const nome_registro = aluna.nome_registro.toLowerCase()
            
            let nome_social = aluna.nome_social
            
            
            if(nome_social) {
                nome_social = nome_social.toLowerCase()
                return nome_social.includes(nome) || nome_registro.includes(nome)
            }

            return nome_registro.includes(nome) 
        })
    }

    if (cidade) {
        alunasFiltradas = alunasFiltradas.filter(aluna => {
            return aluna.cidade == cidade

        })
    }

    if(bairro) {
        alunasFiltradas = alunasFiltradas.filter(aluna => {
            return aluna.bairro == bairro
        })
    }


    if(pai) {
        alunasFiltradas = alunasFiltradas.filter (aluna => {
            return aluna.pai.toLowerCase().includes(pai.toLowerCase())
        })
    }

    if(mae) {
        alunasFiltradas = alunasFiltradas.filter(aluna => {
            return aluna.mae. toLowerCase().includes(mae.toLowerCase())
            // achei estranho ser includes, pois nome de pai e mãe deveria ser estritamente igual

        })
    }



    response.status(200).send(alunasFiltradas)

} catch (error) {
    
    response.status(500).send({message: error.message})

}}



const obterAlunaPorId = async (request, response) => {


}

// alunas/turma/notas
const obterNotas = async (request, response) => {
    
    const { id } = request.params
    
    try {
        
        const alunas = await db()

        const alunaEncontrada = alunas.find(aluna => {
            return aluna.id == id
        })

        // preciso retornar a nota dela e também, nome e a turma

        const notas = alunaEncontrada.notas
        const { ciencias_da_natureza, ciencias_humanas, linguagens_codigos, matematica, redacao} = notas

        

        const resposta = {
            ciencias_da_natureza,ciencias_humanas, linguagens_codigos, 
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

// prof. Minha lógica ficou bem grande, mas foi como eu consegui fazer. Foi bem desafiador fazer isso aqui sozinha, mas deu certo. Com certeza deve ter outras formas de fazer. Vou assistir a gravação da aula de revisão e também da aula de encerramento e subir um segundo commit com a sua versão do código. Mas gostei. 

const obterBoletim = async (request, response) => {

    try {
        const alunas = await db()
        const { turma } = request.params
        
        let turmaFiltrada = alunas.filter(aluna => {
            return aluna.turma.includes(turma)
        })

        if(!turmaFiltrada == turma) {
            return response.status(404).send([])
        }


        let calculoDasMedias = []
        
        for(const aluna of turmaFiltrada) {
            let media = 0
            let notas = aluna.notas
            let nota1 = Number(notas.ciencias_da_natureza)
            let nota2 = Number(notas.ciencias_humanas)
            let nota3 = Number(notas.linguagens_codigos)
            let nota4 = Number(notas.matematica)
            let nota5 = Number(notas.redacao)
        
            media += nota1
            media += nota2
            media += nota3
            media += nota4
            media += nota5
            media /= 5
        
            if (aluna.nome_social == true) {
                return nome_social
            }
        
            let verificarSituacao = function () {
                if (media < 5) {
                    return "REPROVADA"
                } else if (media > 5 && media < 6) {
                    return "RECUPERAÇÃO"
                } else if (media > 6) {
                    return "APROVADA"
                } else {
                    return "Media inválida"
                }
            }
        
            resposta = {
                "ciencias_da_natreza": nota1,
                "ciencias_humanas": nota2,
                "linguagens_codigos": nota3,
                "matematica": nota4,
                "redacao": nota5,
                "media": Number(media.toFixed(2)),
                "situação": verificarSituacao(media),
                "nome": aluna.nome_social || aluna.nome_registro,
                "turma": aluna.turma
            }
            
            calculoDasMedias.push(resposta)
        }

        response.status(200).send(calculoDasMedias)
        
    } catch (error) {

        response.status(500).send({ message: error.message })
    }

    
       
}
    
    
    
    
    







// ver tutorial
const criarAluna = async (request, response) => {

    try {
        const alunas = await db()
        const alunaBody = request.body
        const { rg, cpf, email, nome_registro } = alunaBody

        if(rg == undefined) return response(400).send({message: "RG é obrigatório"})
        if(cpf == undefined) return response.status(400).send("CPF é obrigatório")
        if(email == undefined || email.includes("@") == false) return response.status(400).send({message: "Email é obrigatório"})
        if(nome_registro == undefined) return response.status(400).send({message: "O nome de registro é obrigatório"})

        alunaBody.id = crypto.randomUUID()
        alunas.push(alunaBody)

        response.status(201).send({message: "Aluna incluida com sucesso!"})

    } catch (error) {
        response.status(500).send({message: error.message})
    }
}



const atualizarAluna = async (request, response) => {


}



const deletarAluna = async (request, response) => {


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