const db = require("../database/db");

const crypto = require("crypto");

const obterTodasAsAlunas = async (req, res) => {
  try {
    const alunas = await db();


    const { nome, cidade, bairro, pai, mae } = req.query;

    let alunasFiltradas = alunas.slice();

    if (nome) {
      alunasFiltradas = alunasFiltradas.filter((alunaAtual) => {
        const nome_registro = alunaAtual.nome_registro.toLowerCase();

        let nome_social = alunaAtual.nome_social;

        if (nome_social) {
          nome_social = nome_social.toLowerCase();
          return nome_social.includes(nome) || nome_registro.includes(nome);
        }
        return nome_registro.includes(nome);
      });
    }

    if (cidade) {
      alunasFiltradas = alunasFiltradas.filter((alunaAtual) => {
        return alunaAtual.cidade == cidade;
      });
    }

    if (bairro) {
      alunasFiltradas = alunasFiltradas.filter(
        (alunaAtual) => alunaAtual.bairro == bairro
      );
    }

    if (mae) {
      alunasFiltradas = alunasFiltradas.filter((alunaAtual) => {
        return alunaAtual.mae.toLowerCase().includes(mae.toLowerCase());
      });
    }

    if (pai) {
      alunasFiltradas = alunasFiltradas.filter((alunaAtual) => {
        return alunaAtual.pai.toLowerCase().includes(pai.toLowerCase());
      });
    }

    res.status(200).send(alunasFiltradas);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const obterAlunaPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const alunas = await db();
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);
    if (alunaEncontrada == undefined) {
      return res.status(404).send({
        message: "Aluna não encontrada",
      });
    }
    res.status(200).send(alunaEncontrada);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const obterAlunaPorId = async (req, res) => {
   const { id } = req.params

   try {
      const alunas = await db()
      const alunaEncontrada = alunas.find(aluna => aluna.id  == id)
      if (alunaEncontrada == undefined) {
        return res.status(404).send({ message: "Aluna não encontrada"})
      }
      res.status(200).send(alunaEncontrada)
   } catch (error) {
    res.status(500).send({ message: error.message })
   }
}


const obterNotas = async (req, res) => {
  const { id } = req.params;

  try {
    const alunas = await db();

    const alunaEncontrada = alunas.find((alunaAtual) => alunaAtual.id == id);

    const notas = alunaEncontrada.notas;
    const {
      ciencias_da_natureza,
      ciencias_humanas,
      linguagens_codigos,
      matematica,
      redacao,
    } = notas;

    const resposta = {
      ciencias_da_natureza,
      ciencias_humanas,
      linguagens_codigos,
      matematica,
      redacao,
      turma: alunaEncontrada.turma,
      nome: alunaEncontrada.nome_social || alunaEncontrada.nome_registro,
    };

    res.status(200).send(resposta);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Homework
const obterBoletim = async (req, res) => {
  try {
    const alunas = await db();
    let resposta = [];
    for (const aluna of alunas) {
      const notas = aluna.notas;
      let {
        ciencias_da_natureza,
        ciencias_humanas,
        linguagens_codigos,
        matematica,
        redacao,
      } = notas;

      const soma =
        ciencias_da_natureza +
        ciencias_humanas +
        linguagens_codigos +
        matematica +
        redacao;
      const media = soma / 5;

      if (media > 6.0) {
        situacao = "Foi aprovada";
      } else if (media < 6 && media >= 5.0) {
        situacao = "Em recuperação";
      } else {
        situacao = "Foi reprovada";
      }
      resposta.push({
        ciencias_da_natureza,
        ciencias_humanas,
        linguagens_codigos,
        matematica,
        redacao,
        situacao: situacao,
        media: media,
        nome: aluna.nome_social || aluna.nome_registro,
        turma: aluna.turma,
      });
    }

    res.status(200).send(resposta);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const criarAluna = async (req, res) => {
  try {
    const alunas = await db();

    const alunaBody = req.body;
    const { rg, cpf, email, nome_registro } = alunaBody;

    if (rg == undefined)
      return res.status(400).send({
        message: "Rg é obrigatório",
      });
    if (cpf == undefined)
      return res.status(400).send({
        message: "Cpf é obrigatorio",
      });
    if (email == undefined || email.includes("@") == false) {
      return res.status(400).send({
        message: "email obrigatório",
      });
    }
    if (nome_registro == undefined)
      return res.status(400).send({
        message: "O nome de registro é obrigatório",
      });

    alunaBody.id = crypto.randomUUID();

    alunas.push(alunaBody);

    res.status(201).send(alunaBody);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const atualizarAluna = async (req, res) => {
  const { id } = req.params;
  const { cpf, id: idDeletado, ...alunaBody } = req.body;
  try {
    const alunas = await db();
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);
    if (alunaEncontrada == undefined)
      return res.status(404).send({
        message: "Aluna não encontrada.",
      });
    const keys = Object.keys(alunaEncontrada);

    if (cpf) {
      throw new Error("O CPF não pode ser atualizado");
    }
    keys.forEach((key) => {
      let dadoAtualizado = alunaBody[key];
      if (dadoAtualizado) alunaEncontrada[key] = dadoAtualizado;
    });
    res.status(200).send(alunaEncontrada);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const deletarAluna = async (req, res) => {
  const { id } = req.params;
  try {
    const alunas = await db();
    const alunaIndice = alunas.findIndex((aluna) => aluna.id == id);
    if (alunaIndice === -1)
      return res.status(404).send({
        message: "Aluna não encontrada",
      });
    alunas.splice(alunaIndice, 1);
    res.status(200).send({
      message: " Aluna deletada com sucesso",
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  deletarAluna,
  criarAluna,
  atualizarAluna,
  obterTodasAsAlunas,
  obterAlunaPorId,
  obterNotas,
  obterBoletim,
};
