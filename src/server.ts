// Importando as dependencias
import express from "express";
import * as dotenv from "dotenv";
import routes from "./routes/postsRoutes"

// Configurando o express
const app = express();
routes(app);

// Configurando dotenv
dotenv.config();

// Configurando o .env
declare namespace NodeJS{
  interface ProcessEnv {
    PORT: string;
    STRING_CONEXAO: string;
  }
}

// Criando o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Servidor rodando na porta: ",port);
});