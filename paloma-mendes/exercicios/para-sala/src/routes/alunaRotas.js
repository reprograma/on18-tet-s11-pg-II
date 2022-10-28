const rotas = require("express").Router()
const controller = require("../controller/alunaController")

//localhost:porta/alunas
rotas.get("/", controller.obterTodasAsAlunas)
rotas.get("/:id/notas", controller.obterNotas)
rotas.get("/:turma/boletim", controller.obterBoletim)
rotas.get("/:id", controller.obterAlunaPorId) // ID sozinho sempre vem por ultimo

rotas.post("/criar", controller.criarAluna)
rotas.put("/:id/atualizar", controller.atualizarAluna)
rotas.delete("/:id/deletar", controller.deletarAluna)

module.exports = rotas
