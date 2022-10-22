<h1 align="center">
  <img src="assets/reprograma-fundos-claros.png" alt="logo reprograma" width="500">
</h1>

# Tema da Aula

Turma Online 18 - Todas em Tech  | back-end | Semana 11 | 2022 | Professora Beatriz Ramerindo

<div align="center">
  <img src="./assets/banner.jpg">
</div>

### Instruções
Antes de começar, vamos organizar nosso setup.
* Fork esse repositório 
* Clone o fork na sua máquina (Para isso basta abrir o seu terminal e digitar `git clone url-do-seu-repositorio-forkado`)
* Entre na pasta do seu repositório (Para isso basta abrir o seu terminal e digitar `cd nome-do-seu-repositorio-forkado`)

## Resumo

## Conteúdo

### Documentação

É fundamental quando disponibilizamos uma API ela ter uma documentação com instruçoes para uso.

#### `[GET]`/alunas
retorna todas as alunas

> Aceita como parametro de consulta

| Parametro | Descricao |
| ----------- | ----------- |
| nome | Realiza um filtro pelo nome |
| cidade | Realiza um filtro por cidade |
| bairro | Realiza um filtro por bairro |
| mae | Realiza um filtro pelo nome da mae |
| pai | Realiza um filtro pelo nome do pai |

> resposta: HTTP 200 OK
```json
[
   {
    "id": "7dac422f-0fe5-471e-8721-4e857a955614",
    "nome_social": "Cláudia",
    "nome_registro": "Natsu Daniela Gomes",
    "genero": "Mulher Trans",
    "sexo": "F",
    "email": "claudia-gomes83@email.com",
    "data_nasc": "2004/08/15",
    "cpf": "777.749.847-98",
    "rg": "28.692.250-2",
    "signo": "Leão",
    "mae": "Emanuelly Renata",
    "pai": "Breno Martin Gomes",
    "senha": "hYw35ayOU6",
    "cep": "20251-050",
    "endereco": "Rua Caetano Martins",
    "numero": 916,
    "bairro": "Rio Comprido",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "telefone_fixo": "(21) 3685-6747",
    "celular": "(21) 99365-8069",
    "altura": "1,83",
    "peso": 70,
    "tipo_sanguineo": "A-",
    "cor": "amarelo",
    "notas": {
      "ciencias_da_natureza": 10,
      "ciencias_humanas": 10,
      "linguagens_codigos": 10,
      "matematica": 10,
      "redacao": 10
    },
    "turma": "2022"
  },
]
```
---
#### `[GET]`/alunas/{id}
retorna todas as alunas

> Aceita como parametro de consulta

| Parametro | Descricao |
| ----------- | ----------- |
| id | id da aluna |

> resposta: HTTP 200 OK
```json
{
  "id": "7dac422f-0fe5-471e-8721-4e857a955614",
  "nome_social": "Cláudia",
  "nome_registro": "Natsu Daniela Gomes",
  "genero": "Mulher Trans",
  "sexo": "F",
  "email": "claudia-gomes83@email.com",
  "data_nasc": "2004/08/15",
  "cpf": "777.749.847-98",
  "rg": "28.692.250-2",
  "signo": "Leão",
  "mae": "Emanuelly Renata",
  "pai": "Breno Martin Gomes",
  "senha": "hYw35ayOU6",
  "cep": "20251-050",
  "endereco": "Rua Caetano Martins",
  "numero": 916,
  "bairro": "Rio Comprido",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "telefone_fixo": "(21) 3685-6747",
  "celular": "(21) 99365-8069",
  "altura": "1,83",
  "peso": 70,
  "tipo_sanguineo": "A-",
  "cor": "amarelo",
  "notas": {
  "ciencias_da_natureza": 10,
  "ciencias_humanas": 10,
  "linguagens_codigos": 10,
  "matematica": 10,
  "redacao": 10
  },
  "turma": "2022"
},
```
---
#### `GET` /alunas/{id}/notas
retorna as notas de uma aluna

> É necessário o ID da aluna

| Parametro | Descricao |
| ----------- | ----------- |
|  id |  id da aluna |

> resposta: HTTP 200 OK
```json
{
  "ciencias_da_natureza": 10,
  "ciencias_humanas": 10,
  "linguagens_codigos": 10,
  "matematica": 10,
  "redacao": 10
};
```
---
#### `GET` /alunas/{turma}/boletim
retorna o boletim de todas as alunas daquela turma

| Parametro | Descricao |
| ----------- | ----------- |
|  turma |  turma da aluna |

> resposta: HTTP 200 OK
```json
[{
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
    "situacao" : "APROVADO",
    "media" : 10,
    "turma": "2022",
    "nome" : "Cláudia"
}];
```
---
#### `[POST]` /alunas
cadastra uma aluna

> Requirido body


<details>
  <summary>Exemplo - Request</summary>

```json 
   {
    "nome_social": "Cláudia",
    "nome_registro": "Natsu Daniela Gomes",
    "genero": "Mulher Trans",
    "sexo": "F",
    "email": "claudia-gomes83@email.com",
    "data_nasc": "2004/08/15",
    "cpf": "777.749.847-98",
    "rg": "28.692.250-2",
    "signo": "Leão",
    "mae": "Emanuelly Renata",
    "pai": "Breno Martin Gomes",
    "senha": "hYw35ayOU6",
    "cep": "20251-050",
    "endereco": "Rua Caetano Martins",
    "numero": 916,
    "bairro": "Rio Comprido",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "telefone_fixo": "(21) 3685-6747",
    "celular": "(21) 99365-8069",
    "altura": "1,83",
    "peso": 70,
    "tipo_sanguineo": "A-",
    "cor": "amarelo",
    "turma": "2022"
  },
```
</details>

> resposta: HTTP 201 OK

```json
 {
    "id": "7dac422f-0fe5-471e-8721-4e857a955614",
    "nome_social": "Cláudia",
    "nome_registro": "Natsu Daniela Gomes",
    "genero": "Mulher Trans",
    "sexo": "F",
    "email": "claudia-gomes83@email.com",
    "data_nasc": "2004/08/15",
    "cpf": "777.749.847-98",
    "rg": "28.692.250-2",
    "signo": "Leão",
    "mae": "Emanuelly Renata",
    "pai": "Breno Martin Gomes",
    "senha": "hYw35ayOU6",
    "cep": "20251-050",
    "endereco": "Rua Caetano Martins",
    "numero": 916,
    "bairro": "Rio Comprido",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "telefone_fixo": "(21) 3685-6747",
    "celular": "(21) 99365-8069",
    "altura": "1,83",
    "peso": 70,
    "tipo_sanguineo": "A-",
    "cor": "amarelo",
    "notas": {},
    "turma": "2022"
  },
```

---
#### `[POST]` /alunas/{id}/notas
cadastra as notas de uma aluna

> Requirido body


<details>
  <summary>Exemplo - Request</summary>

```json 
{
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
};
```
</details>

> resposta: HTTP 201 OK

```json
 {
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
 },
```
---
#### `[PUT]`/alunas/{id}
Atualiza uma aluna

Body [exemplo](#post-alunas)

> resposta: HTTP 200 OK

```json
 {
    "id": "7dac422f-0fe5-471e-8721-4e857a955614",
    "nome_social": "Cláudia",
    "nome_registro": "Natsu Daniela Gomes",
    "genero": "Mulher Trans",
    "sexo": "F",
    "email": "claudia-gomes83@email.com",
    "data_nasc": "2004/08/15",
    "cpf": "777.749.847-98",
    "rg": "28.692.250-2",
    "signo": "Leão",
    "mae": "Emanuelly Renata",
    "pai": "Breno Martin Gomes",
    "senha": "hYw35ayOU6",
    "cep": "20251-050",
    "endereco": "Rua Caetano Martins",
    "numero": 916,
    "bairro": "Rio Comprido",
    "cidade": "Rio de Janeiro",
    "estado": "RJ",
    "telefone_fixo": "(21) 3685-6747",
    "celular": "(21) 99365-8069",
    "altura": "1,83",
    "peso": 70,
    "tipo_sanguineo": "A-",
    "cor": "amarelo",
    "notas": {},
    "turma": "2022"
  },
```


---
#### `[PUT]`/alunas/{id}/notas
Atualiza a nota de uma aluna



Body [exemplo](#post-alunasalunaidnotas)


> resposta: HTTP 200 OK

```json
 {
    "ciencias_da_natureza": 10,
    "ciencias_humanas": 10,
    "linguagens_codigos": 10,
    "matematica": 10,
    "redacao": 10,
 },
```

---
#### `[DELETE]`/alunas/{id}
Deleta uma aluna

> É necessário o ID da aluna

| Parametro | Descricao |
| ----------- | ----------- |
|  id |  id da aluna |


> resposta: HTTP 204 NO CONTENT

```json
 { }
```
---
### Arquitetura do projeto

```
📂 API     
├─ 📂 src 
│  ├─ 📂 controllers
│  │  └─ alunasController.js
│  ├─ 📂 models
│  │  └─ alunasModel.js
│  ├─ 📂 database
│  │  └─ banco.js
│  ├─ 📂 routes
│  │  └─ alunasRouter.js
│  └─ app.js
├─ package-lock.json
├─ package.json
├─ .gitignore 
├─ README.md
└─ server.js
```

### Dependencias

| Dependencia | Versao |
| ----------- | ----------- |
| NodeJs | >= 14x |
| NPM | >= 8x |
| Express | - |
| Nodemon | - |


### Exercícios 
* [Exercicio para sala](./exercicios/para-sala/README.md
* [Exercicio para casa](./exercicios/projeto-casa/README.md)

### Material da aula 
 - 
### Links Úteis
- [O que é uma API](https://aws.amazon.com/pt/what-is/api/)
- [Playlist - Javascript Resumo](https://www.youtube.com/playlist?list=PL9rc_FjKlX39T78CUANwmdta_d1CgUtMt)
- [API Rest Boas Praticas](https://restfulapi.net/rest-api-design-tutorial-with-example/)
- [URL / URI Convenção](https://restfulapi.net/resource-naming/)
- [Api Rest Boas Praticas Endpoint](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/)
- [ CQRS ](https://pt.stackoverflow.com/questions/181688/o-que-%C3%A9-cqrs-e-como-implementar)
- [ CRUD ](https://blog.betrybe.com/tecnologia/crud-operacoes-basicas/)
- [ JavaScript: Destructuring ](https://www.devmedia.com.br/javascript-destructuring-assignment/41201)

#### **Obrigada meninas, Bea**

- [instagram](https://www.instagram.com/isjanebea)
- [linkedin](https://www.linkedin.com/in/beatriz-ramerindo/)
- [github](https://github.com/isjanebia)
- email: [bea@ramerindo.com.br](mailto:bea@ramerindo.com.br)

<p align="center">
  Desenvolvido com :purple_heart:  
</p>


