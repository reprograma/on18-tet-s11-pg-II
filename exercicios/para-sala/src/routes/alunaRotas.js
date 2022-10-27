const router = require("express").Router();

const controller = require("../controller/alunaController")

router.get("/",controller.obterTodasAsAlunas) //find === [0]
router.get("/:id/notas",controller.obterNotas) // find === [1]
router.get("/:turma/boletim",controller.obterBoletim) // find === [2]
router.get("/:id",controller.obterAlunaPorId) // find === [3]

router.post("/criar",controller.criarAluna)

router.put("/:id/atualizar/",controller.atualizarAluna) // find === [0]

router.delete("/:id/deletar",controller.deletarAluna) //find === [0]

module.exports = router