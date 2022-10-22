const routes = require("express").Router();
const controller = require("../controller/alunaController");

routes.get("/", controller.getAllStudents);
routes.get("/:id/notas", controller.getGrades);
routes.get("/:id", controller.getStudentById);
routes.get("/alunas/:turma/boletim", controller.getReportCard);

routes.post("/criar", controller.createStudent);
routes.put("/:id/atualizar", controller.updateStudent);
routes.delete("/:id/deletar", controller.deleteStudent);

module.exports = routes;
