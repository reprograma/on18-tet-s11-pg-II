const db = require("../database/db");

const crypto = require("crypto");

const obterTodasAsAlunas = async (req, res) => {
  try {
    const alunas = await db();

    const { nome, cidade, bairro, pai, mae, ativa = true } = req.query;

    let alunasFiltradas = alunas.filter(aluna => aluna.ativa == JSON.parse(ativa))

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
      return res.status(404).send({ message: "Aluna não encontrada" });
    }
    res.status(200).send(alunaEncontrada);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

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

const criarNotas = async (req, res) => {
  const { id } = req.params;
  const {
    ciencias_da_natureza,
    ciencias_humanas,
    linguagens_codigos,
    matematica,
    redacao,
  } = req.body;

  try {
    const alunas = await db();
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);
    if (!alunaEncontrada)
      return res.status(500).send({
        message: `Aluna com o id ${id} não encontrada!`,
      });
    alunaEncontrada.notas = {
      ciencias_da_natureza,
      ciencias_da_natureza,
      ciencias_humanas,
      linguagens_codigos,
      matematica,
      redacao,
    };

    res.status(201).send({
      id,
      ...alunaEncontrada.notas,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const atualizarNotas = async (req, res) => {
  const { id } = req.params;
  const notasBody = req.body;

  try {
    const alunas = await db();
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);
    if (!alunaEncontrada)
      return res.status(500).send({
        message: `Aluna com o id ${id} não encontrada!`,
      });
    const notas = alunaEncontrada.notas;

    const notasChaves = Object.keys(notas);

    for (const chave of notasChaves) {
      const nota = notasBody[chave];

      if (nota) notas[chave] = nota;
    }

    res.status(201).send(id, ...alunaEncontrada.notas);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const obterBoletimComForOf = async (req, res) => {
  const { turma } = req.params;

  try {
    const alunas = await db();
    const alunasBoletim = [];

    for (const aluna of alunas) {
      if (aluna.turma != turma) continue; // pulo para a proxima interacao do loop
      let media = 0;
      const notas = Object.values(aluna.notas);
      for (const nota of notas) {
        media += +nota; //
      }
      media = media / notas.length;
      let situacao = "NAO COMPUTADA";

      if (media > 6) situacao = "APROVADA";
      else if (media < 5) situacao = "REPROVADA";
      else if (media >= 5 && media <= 6) situacao = "RECUPERACAO";

      const boletim = {
        ...aluna.notas,
        situacao,
        media,
        nome: aluna.nome_social || aluna.nome_registro,
        turma: aluna.turma,
      };

      alunasBoletim.push(boletim);
    }

    if (alunasBoletim.length == 0) {
      return res.status(404).send({
        message: "Não existe essa turma: " + turma,
      });
    }

    res.status(200).send(alunasBoletim);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const obterBoletimComForEach = async (req, res) => {
  const { turma } = req.params;

  try {
    const alunas = await db();
    const alunasFiltradas = alunas.filter((aluna) => aluna.turma == turma);

    if (alunasFiltradas.length == 0) {
      return res.status(404).send({
        message: "Não existe essa turma: " + turma,
      });
    }
    const alunasBoletim = [];

    alunasFiltradas.forEach((alunaAtual) => {
      const notas = alunaAtual.notas;
      const {
        ciencias_da_natureza,
        ciencias_humanas,
        linguagens_codigos,
        matematica,
        redacao,
      } = notas; // extraio todas as notas
      const diciplinas = 5 // defino a quantidade de disciplinas
      const media =
        (
            Number(ciencias_da_natureza) +
            Number(ciencias_humanas) +
            Number(linguagens_codigos) +
            Number(matematica) +
            Number(redacao)
         ) / diciplinas; // somo todas as notas e divido pelo total

      let situacao = "NAO COMPUTADA";
      // faco as verificacoes
      if (media > 6) situacao = "APROVADA";
      else if (media < 5) situacao = "REPROVADA";
      else if (media >= 5 && media <= 6) situacao = "RECUPERACAO";

      const boletim = { // crio o boletim que sera retornado para o client
        ciencias_da_natureza,
        ciencias_humanas,
        linguagens_codigos,
        matematica,
        redacao,
        turma: alunaAtual.turma,
        nome: alunaAtual.nome_social || alunaAtual.nome_registro,
        situacao,
        media,
      };
      alunasBoletim.push(boletim);
    });

    res.status(200).send(alunasBoletim);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const obterBoletim = async (req, res) => {
  const { turma } = req.params;

  try {
    const alunas = await db();
    // filtro as alunas por turma
    const alunasFiltradas = alunas.filter((aluna) => aluna.turma == turma);

    // envio uma mensagem caso a turma não exista
    if (alunasFiltradas.length == 0) {
      return res.status(404).send({
        message: "Não existe essa turma: " + turma,
      });
    }

    // faço um mapeamento dos dados
    const alunasBoletim = alunasFiltradas.map((aluna) => {
      const notas = Object
        .values(aluna.notas) // pego todas as notas
        .map(nota => Number(nota)) // converto todas as notas para numero
      
      // faço uma soma de todas as notas com o método reduce
      const total = notas.reduce((total, nota) => total + nota, 0)
      // calculo a media
      const media = total / notas.length

      // defino a situacoa inicial
      let situacao = "NAO COMPUTADA";
      // execulto as regras de negocio
      if (media > 6) situacao = "APROVADA";
      else if (media < 5) situacao = "REPROVADA";
      else if (media >= 5 && media <= 6) situacao = "RECUPERACAO";

      // crio o boletim
      const boletim = {
        ...aluna.notas, // seria o equivalente a extrair nota por nota
        situacao,
        media,
        nome: aluna.nome_social || aluna.nome_registro,
        turma: aluna.turma,
      };

      return boletim;
    });

    res.status(200).send(alunasBoletim);
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
        message: "Rg é obrigario",
      });
    if (cpf == undefined)
      return res.status(400).send({
        message: "Cpf é obrigatorio",
      });
    if (email == undefined || email.includes("@") == false) {
      return res.status(400).send({
        message: "email obrigario",
      });
    }
    if (nome_registro == undefined)
      return res.status(400).send({
        message: "O nome de registro é obrigario",
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
  //
  const {
    cpf,
    id: idDeletado, // extraimos(remover) o cpf e o id do body
    ...alunaBody // agrupou todo o resto, sem o id e o cpf
  } = req.body;
  // delete alunaBody.cpf; delete alunaBody.id
  try {
    const alunas = await db();
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);

    if (alunaEncontrada == undefined)
      return res.status(404).send({
        message: "Aluna não encontrada.",
      });

    const chaves = Object.keys(alunaEncontrada);

    if (cpf) {
      throw new Error("O Cpf não pode ser atualizado.");
    }

    chaves.forEach((chave) => {
      let dadoAtualizado = alunaBody[chave]; // acessa a propriedade(valor) que vem body
      let existeDado = new Boolean(dadoAtualizado); // valida se existe um dado
      if (existeDado == true) alunaEncontrada[chave] = dadoAtualizado; // atualiza o dado
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
    const alunaEncontrada = alunas.find((aluna) => aluna.id == id);

    if (alunaEncontrada == undefined)
      return res.status(404).send({
        message: "Aluna não encontrada.",
      });

    alunaEncontrada.ativa = false

    res.status(200).send({ message: "Aluna deletada com sucesso!" });
  } catch (error) {
    res.status(500).send({ message: error.message });
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
  atualizarNotas,
  criarNotas,
};
