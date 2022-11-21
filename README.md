# ToDo List App
![](https://live.staticflickr.com/65535/52497603832_321b9e9147_m.jpg)
<br/>

### Tecnologias utilizadas:
**Backend:** `NodeJS` `NestJS` `Typescript` `TypeORM` `PostgreSQL` `BCrypt` `JWT` `Swagger` <br/>

#### Instalando a aplicação:
*Antes de prosseguir é necessário possuir o Docker instalado em seu ambiente.
[Docker_Install](https://docs.docker.com/engine/install)

**1º Passo:** Download do repositório:
```sh
$ git clone "git@github.com:WebertonMendes/wm-todo-api.git"
```

**2º Passo:** Acesse o arquivo ".env" e defina os valores das variavéis: <br/>
- "JWT_SECRET"
- "TYPEORM_USERNAME"
- "TYPEORM_PASSWORD" <br/>

**3º Passo:** Acessar pelo terminal o diretório onde o projeto foi clonado, <br/>
e executar o comando abaixo para a criação dos containers:
```sh
## Start Docker Application:
docker-compose up -d
##
```

**URLs disponíveis da aplicação em produção:**
Documentação API: "https://wm-todo-api.herokuapp.com/api/v1/docs" <br/>
URL API: "https://wm-todo-api.herokuapp.com/api/v1" <br/>
