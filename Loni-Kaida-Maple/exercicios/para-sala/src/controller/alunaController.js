const db = require("../database/db");
const crypto = require("crypto");
const getAllStudents = async (req, res) => {
    try {
        const students = await db();

        const { nome, cidade, bairro, pai, mae } = req.query;
        let filterdStudents = students.slice();

        if(nome){
            filterdStudents = filterdStudents.filter(atualStudent => {
                const resgister_name = atualStudent.nome_registro.toLowerCase();
                let social_name = atualStudent.nome_social;
                if(social_name){
                    social_name = social_name.toLowerCase();
                    return social_name.includes(nome) || resgister_name.includes(nome) || false;
                }

                return resgister_name.includes(nome);
                

            })
        }

        if(cidade){
            //filterdStudents = filterdStudents.filter
        }

        if(bairro){
            filterdStudents = filterdStudents.filter(atualStudent => atualStudent.bairro == bairro);
        }

        if(pai){
            filterdStudents = filterdStudents.filter(atualStudent => {
                return atualStudent.pai.toLowerCase().includes(pai.toLowerCase());
            })
        }

        if(mae){
            filterdStudents = filterdStudents.filter(atualStudent => {
                return atualStudent.mae.toLowerCase().includes(mae.toLowerCase());
            })
        }
        



        res.status(200).send(students);
        console.log("sendin request  "+students);
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

const getStudentById = async (req, res) => {

}

const getGrades = async (req, res) => {
    const { id } = req.params;

    try {
        const students = await db();

        const foundStudent = students.filter(atualStudent => atualStudent.id == id);

        const grades = foundStudent.notas;

        const {
            ciencias_da_natureza, ciencias_humanas, linguagens_codigos, matematica, redacao
        } = grades;

        const awnser = {
            ciencias_da_natureza,
			ciencias_humanas,
			linguagens_codigos,
			matematica,
			redacao,
            turma: foundStudent.turma,
            nome: foundStudent.nome_social || foundStudent.nome_registro
        }

        res.status(200).send(awnser);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const createStudent = async (req, res) => {
    try {
        const students = await db();
        const studantBody = req.body;

        const { rg, cpf, email, nome_registro} = studantBody;

        if(rg == undefined) return res.status(400).send({
            message: "Rg é obrigatorio"
        })
        if(cpf == undefined) return res.status(400).send({
            message: "cpf é obrigatorio"
        })
        if(email == undefined || email.includes("@") == false) return res.status(400).send({
            message: "email é obrigatorio"
        })
        if(nome_registro == undefined) return res.status(400).send({
            message: "nome de registro é obrigatorio"
        })

        studantBody.id = crypto.randomUUID();
        students.push(studantBody);

    } catch (error) {
        
    }

}

const updateStudent = async (req, res) => {

}

const deleteStudent = async (req, res) => {

}

const getReportCard = async (req, res) => {

}

module.exports = {
    getAllStudents,
    getStudentById,
    getGrades,
    createStudent,
    updateStudent,
    deleteStudent,
    getReportCard
};