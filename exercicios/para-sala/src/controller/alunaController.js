const db=require('../database/db.js')



const obterAlunas = async(req,res)=>{
    try{
        const bancoDados=await db()
        const {nome, cidade, bairro, mae, pai}=req.query
        let alunosNome= bancoDados.slice()


        // if(nome){
        //     alunosNome=alunosNome.filter(nomeFiltrado=>{
        //         let nomeSocial=nomeFiltrado.nome_social

        //         let nomeNascimento=nomeFiltrado.nome_registro.toLowerCase()

        //         if(nomeSocial){
        //             return nomeSocial.includes(nome) && nomeNascimento.includes(nome)
        //         }
        //         return nomeNascimento.includes(nome)

        //     })

        // }

        if (nome){
            alunosNome = alunosNome.filter(aluna =>{ 
            const nome_registro = aluna.nome_registro.toLowerCase() 
            let nome_social =     aluna.nome_social 

            if(nome_social){ nome_social = nome_social.toLowerCase() 
                return nome_social.includes(nome) || nome_registro.includes(nome) 
            } 
            return nome_registro.includes(nome) 
        
        }) } 

        if(cidade){
            alunosNome=alunosNome.filter(filtrandoCidade=>{
                return filtrandoCidade.cidade==cidade
            })
        }
        if(bairro){
            alunosNome=alunosNome.filter(filtrandoEstado=>{
                return filtrandoEstado.bairro==bairro
            })
        }
        if(mae){
            alunosNome=alunosNome.filter(maeAluna=>{
                return maeAluna.mae.toLowerCase().includes(mae.toLowerCase())
            })
        }
        if(pai){
            alunosNome=alunosNome.filter(paiAluna=>{
                return paiAluna.pai.toLowerCase().includes(pai.toLowerCase())
            })
        }

        res.status(200).send(alunosNome)
    }
    catch (error){
        res.status(500).send({message:error.message})
    }

}

const encontrarById= async(req,res)=>{

            const {id}=req.query
    try{
            let bancoAlunas=await db()
            let alunaEncontrada=bancoAlunas.find(aluna=>aluna.id==id)
            

        if(alunaEncontrada==undefined){
            res.status(404).send({message:'Aluna não foi encontrada'})
        }
        return res.status(200).send(alunaEncontrada)

    // if(id){
    //         novoBanco=novoBanco.filter(idFiltrado=>{
    //         let idAluna=idFiltrado.id
            
    //         return idAluna===id
    //     })
    //      res.status(200).send(novoBanco)
    // }
       
    // else{
    //     res.status(404).send({message:'Aluna não encontrada'})
    // }
    }
    
    catch(error){
        res.status(500).send({message:error.message})
    }

}

const returnNotaAluna= async(req,res)=>{
    const {turma}=req.query
    const banco=await db()
    try{
            const filtrandoTumas=banco.filter(filtroTurmas=>filtroTurmas.turma==turma )
            
        // if(filtrandoTumas==undefined){
        //     console.log('entrou')
        //         res.status(404).send({message:'Turma não encontrada'})
        //      }
        if(turma==undefined){
          return res.status(404).send({message:'Turma não encontrada'})
        }
        if(filtrandoTumas){
          
        }
    }

    catch(error){
        res.status(500).send({message:error})
    }
    
}
             

const obterBoletim= async(req,res)=>{

}
const criarAluna=async(req,res)=>{
    let {nome,email,cpf}=req.query
    let banco=await db();
    try{

    }
    catch(error){
        res.status(500).send({message:'Aluna Não foi criada, houve algum erro'})
    }

}
const atualizarAluna=async(req,res)=>{

}
const deletarAluna=async(req,res)=>{
    const {id}=req.query
    let banco=await db();

    try{

        let filtrandoId=banco.findIndex(aluna=> aluna.id==id )

        if(id==undefined || filtrandoId===-1){
           return res.status(404).send({message:'Aluna não encontrada'})
        }
        
       banco.slice(filtrandoId,1)
       res.status(200).send({message:'Aluna foi deletada com sucesso'})
    }
    catch(error){
        res.status(500).send({message:error.message})
    }

}



module.exports={
    obterAlunas,
    encontrarById,
    returnNotaAluna,
    obterBoletim,
    criarAluna,
    atualizarAluna,
    deletarAluna
}