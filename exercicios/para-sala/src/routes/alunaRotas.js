const rotas=require('express').Router()

const controller=require('../controller/alunaController')

rotas.get('/', controller.obterAlunas)
rotas.get('/:turma/boletim', controller.obterBoletim)
rotas.get('/:id/notasAlunas', controller.returnNotaAluna)
rotas.get('/:id', controller.encontrarById)


rotas.post('/criar', controller.criarAluna)
rotas.put('/:id/atualizarAlunas', controller.atualizarAluna)
rotas.delete('/:id/alunaDelete', controller.deletarAluna)



module.exports=rotas