const obterBoletim = async (request, response) => {
    const { turma } = request.params;
  
    try {
      const alunas = await db();
      // filtro as alunas por turma
      const alunasFiltradas = alunas.filter((aluna) => aluna.turma == turma);
  
      // envio uma mensagem caso a turma não exista
      if (alunasFiltradas.length == 0) {
        return response.status(404).send({
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
  
      response.status(200).send(alunasBoletim);
    } catch (error) {
      response.status(500).send({ message: error.message });
    }
  }

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
