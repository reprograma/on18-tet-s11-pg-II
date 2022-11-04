# Exercício de Casa 🏠 

## Projeto Guiado 2

### Exercicio - Cade o meu boletin?

Para finarlizamos o nosso projeto guiado, ficou faltando um endpoint que retorne o boletin de todos os alunos.

#### Regras de negocio

1. Será necessario filtrar as alunas pela turma que foi recebida via parametros
2. Será necessário obter a média de todas as disciplinas e a 
3. partir dessa média definir a situacao da aluna

regras:
nota maior que 6 - "APROVADA"
nota maior que 5 e menor que 6 - "RECUPERACAO"
nota menor que 5 - "REPROVADA"

construir a resposta para corresponder ao exemplo abaixo

Detalhes do endpoint:
GET /alunas/

resposta esperada:

```json
  [
{
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
    "situacao" : "APROVADO",
    "media" : 10,
    "nome" : "Beatriz",
    "turma": "2022"
},
{
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
    "situacao" : "APROVADO",
    "media" : 10,
    "nome" : "Jane" ,
    "turma": "2022"
}
/* outras alunas... */
];
```

Continuar no para sala, não é necessário criar uma API do zero.

Terminou o exercício? Dá uma olhada nessa checklist e confere se tá tudo certinho, combinado?!

- [ ] Fiz o fork do repositório.
- [ ] Clonei o fork na minha máquina (`git clone url-do-meu-fork`).
- [ ] Resolvi o exercício.
- [ ] Adicionei as mudanças. (`git add .` para adicionar todos os arquivos, ou `git add nome_do_arquivo` para adicionar um arquivo específico)
- [ ] Commitei a cada mudança significativa ou na finalização do exercício (`git commit -m "Mensagem do commit"`)
- [ ] Pushei os commits na minha branch (`git push origin nome-da-branch`)
- [ ] Criei um Pull Request seguindo as orientaçoes que estao nesse [documento](https://github.com/mflilian/repo-example/blob/main/exercicios/para-casa/instrucoes-pull-request.md).
