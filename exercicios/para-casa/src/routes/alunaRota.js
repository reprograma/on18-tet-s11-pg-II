const rotas = require("express").Router()
const controller = require("../controllers/alunaController")

rotas.get("/", controller.obterTodasAsAlunas) 
rotas.get("/:id/notas", controller.obterNotas) 
rotas.get("/:turma/boletim", controller.obterBoletim)
rotas.get("/:id", controller.obterAlunaPorId)

rotas.post("/criar", controller.criarAluna)
rotas.put("/:id/atualizar", controller.atualizarAluna)
rotas.delete("/:id/deletar", controller.deletarAluna)

module.exports = rotas
