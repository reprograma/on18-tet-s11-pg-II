
// PARA CASA 
const boletim = async (req, res) => {
    const { turma } = req.params
  try {
    const alunas = await db()

    const alunasEncontradas = alunas.filter(alunaAtual => alunaAtual.turma == turma)

    let notasAlunas;
    let media;
    let alunasFiltradas = [];

    alunasEncontradas.forEach(aluna => {
      notasAlunas = Object.values(aluna.notas)
      media = (notasAlunas.reduce((acumulador, nota) => Number(acumulador) + Number(nota))) / 5

      if (media > 6) {
        situacao = "APROVADA"
      } else if (media > 5) {
        situacao = "RECUPERAÇÃO"
      } else {
        situacao = "REPROVADA"
      }
      const resposta = {
        ciencias_da_natureza: aluna.notas.ciencias_da_natureza,
        ciencias_humanas: aluna.notas.ciencias_humanas,
        linguagens_codigos: aluna.notas.linguagens_codigos,
        matematica: aluna.notas.matematica,
        redacao: aluna.notas.redacao,
        situacao: situacao,
        media: media,
        nome: aluna.nome_social || aluna.nome_registro,
        turma: aluna.turma
      }
      alunasFiltradas.push(resposta)
    });

    res.status(200).send(alunasFiltradas)

  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

