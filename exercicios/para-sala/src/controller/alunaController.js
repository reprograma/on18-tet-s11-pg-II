const db = require("../database/db")

const crypto = require("crypto")


const obterTodasAsAlunas = async(req,res)=>{
    try{
        const alunas = await db()

        const {nome, cidade, estado} = req.query;

        //A gente vai pegar uma CÓPIA de alunas, usando slice
        //Por que ? porque a gente não quer alterar nem cortar o banco de dados
        let alunasFiltradas = alunas.slice()

        //if (!nome_social) == não existe. o ! significa não existir
            //if (nome_social) existe, faça isso:
        if (nome){
            alunasFiltradas = alunasFiltradas.filter(alunaAtual=>{
            
                const nome_registro = alunaAtual.nome_registro.toLowerCase()
                let nome_social = alunaAtual.nome_social
                
                //let nome_social = alunaAtual.nome_social
                //if (nome_social) nome_social = nome_social.toLowerCase()
                if (nome_social){
                    nome_social = nome_social.toLowerCase()
                    return nome_social.includes(nome) || nome_registro.includes(nome)
                }
                return nome_registro.includes(nome)
                })
        }

        if (cidade){
            alunasFiltradas = alunasFiltradas.filter(alunaAtual =>{
                return alunaAtual.cidade == cidade
            })
        }

        if (estado){
            alunasFiltradas = alunasFiltradas.filter(alunaAtual =>{
                return alunaAtual.estado == estado
            })
        }

        res.status(200).send(alunasFiltradas)
    }catch (error){
        res.status(500).send({
            message: error.message
        })
    }
}

const obterAlunaPorId = async (req,res)=>{
    const {id} = req.params

    try{
        const alunas = await db()
        const alunaEncontrada = aluna.find(aluna =>aluna.id == id)
        if (alunaEncontrada == undefined){
            return res.status(404).send({message: "Aluna não encontrada"})
        }
        res.status(200).send(alunaEncontrada)
    }catch (error){
        res.status(500).send({message:error.message})
    }
}

const obterNotas = async(req,res)=>{
    const {id} = req.params

    try{
    const alunas = await db();
    // aluna.turma

    const alunaEncontrada = alunas
    .find(alunaAtual =>alunaAtual.id == id)

    const notas = alunaEncontrada.notas
    const {ciencias_da_natureza, ciencias_humanas, linguagens_codigos,matematica,redacao} = notas

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

    }catch (error){
    res.status(500).send({message: error.message})
    }
}

const obterBoletim = async(req,res)=>{
    const alunas = await db();
    const {turma} = req.params
    resultado = []

    try{
        const alunasEncontradas = alunas.filter((alunaAtual)=> alunaAtual.turma == turma)

        alunasEncontradas.forEach(aluna => {
            
            const {ciencias_da_natureza, ciencias_humanas, linguagens_codigos,matematica,redacao} = aluna.notas
            
            let situacao;
    
            const media = 
            (parseFloat(ciencias_da_natureza) + 
            parseFloat(ciencias_humanas) + 
            parseFloat(linguagens_codigos) + 
            parseFloat(redacao) + 
            parseFloat(matematica)) 
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

const criarAluna = async(req,res)=>{
    try{
        const alunas = await db()

        const alunaBody = req.body;
        const {rg, cpf, email, nome_registro} = alunaBody
    
        if (!rg) return res.status(400).send({
            message: "RG é obrigatório"
        })
        if (!cpf) return res.status(400).send({
            message: "CPF é obrigatório"
        })
        if (!email || email.includes("@") == false) return res.status(400).send({
            message: "Email inválido"
        })
        if (!nome_registro) return res.status(400).send({
            message: "Nome é obrigatório"
        })

        alunaBody.id = crypto.randomUUID()

        alunas.push(alunaBody)

        res.status(201).send(alunaBody)

    }catch(error){
        res.status(500).send({
            message: error.message
        })
    }
}

const atualizarAluna = async(req,res)=>{
    const {id} = req.params;
    const {cpf, 
        id: idDeletado, 
        ...alunaBody
    } = req.body
    
    try{
        const alunas = await db()
        const alunaEncontrada = alunas.find(aluna =>aluna.id ==id)
        
        if (alunaEncontrada == undefined) return res.status(404).send({
            message: "Aluna não encontrada."
        })
        
        const chaves = Object.keys(alunaEncontrada)

        if (cpf){
            throw new Error("O CPF não pode ser atualizado")
        }
        
        chaves.forEach(chave =>{
            let dadoAtualizado = alunaBody[chave]
            let existeDado = new Boolean(dadoAtualizado);
            if (existeDado ==true) alunaEncontrada[chave] = dadoAtualizado
        })

        res.status(200).send(alunaEncontrada)
    }catch (error){
        res.status(500).send({
            message: error.message
        })
}
}

const deletarAluna = async(req,res)=>{
    const {id} = req.params;

    try{
        const alunas = await db()
        const alunaIndice = alunas.findIndex(aluna =>aluna.id == id)

        if (alunaIndice === -1) return res.status(404).send({
            message: "Aluna não encontrada"
        })
        
        alunas.splice(alunaIndice,1)
        
        res.status(200).send({message: "Aluna deletada com sucesso"})

    }catch (error){
        res.status(500).send({message: error.message})
    }
}

module.exports = {
    criarAluna,
    atualizarAluna,
    deletarAluna,
    obterTodasAsAlunas,
    obterAlunaPorId,
    obterNotas,
    obterBoletim
}