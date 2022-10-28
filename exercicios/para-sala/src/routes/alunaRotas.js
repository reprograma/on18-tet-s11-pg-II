const rotas = require("express").Router()
const controller = require("../controller/alunaController")

rotas.get("/", controller.obterTodasAsAlunas) 
rotas.get("/:id/notas", controller.obterNotas) 
rotas.get("/:turma/boletim", controller.obterBoletim)
rotas.get("/:id", controller.obterAlunaPorId)

rotas.post("/criar", controller.criarAluna)
rotas.post("/:id/notas/criar", controller.criarNotas)
rotas.put("/:id/atualizar", controller.atualizarAluna)
rotas.put("/:id/notas/atualizar", controller.atualizarNotas)
rotas.delete("/:id/deletar", controller.deletarAluna)

module.exports = rotas