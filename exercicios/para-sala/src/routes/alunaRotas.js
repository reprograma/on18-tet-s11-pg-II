const rotas = require ("express").Router()
const controller = require("../controller/alunaController")
//localhost: porta/alunas
//localhost: porta/
rotas.get("/", controller.obterTodasAsAlunas)
rotas.get("/:id/notas" , controller.obterNotas)
rotas.get("/:id",controller.obterAlunaPorId)
rotas.get("/:id/boletim",controller.obterBoletim)

rotas.post("/criar", controller.criarAluna)
rotas.put("/:id/atualizar", controller.atualizarAluna)
rotas.delete("/:id/deletar", controller.deletarAluna)

module.exports = rotas