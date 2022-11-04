const rotas = require("express").Router()

//importar controller
const controller = require("../controller/alunaController")

rotas.get("/", controller.obterTodasAsAlunas)
rotas.get("/:id/notas", controller.obterNotas)
rotas.get("/:turma/boletim", controller.boletim)
rotas.get("/:id", controller.ObterAlunaPorId)

rotas.post("/criar", controller.criarAluna)
rotas.put("/:id/atualizar", controller.atualizarAluna)
rotas.delete("/:id/deletar", controller.deletarAluna)

module.exports = rotas