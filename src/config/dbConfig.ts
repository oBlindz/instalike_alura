import * as dotenv from "dotenv";
dotenv.config();

import { MongoClient, Db } from "mongodb";

const url = process.env.STRING_CONEXAO!;

if (!url) {
  throw new Error("A variável de ambiente 'STRING' não está definida.");
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function conectarAoBanco(): Promise<Db>{
  if(db){
    console.log("Reutilizando conexão com o banco...");
    return db;
  }

  try {
    client = new MongoClient(url);
    await client.connect();
    console.log("Conectado ao Mongo Db!");
    db = client.db("imersao_dev_backend");
    return db;
  } catch (erro) {
    console.error("Erro ao conectar ao banco: ",erro);
    throw erro;
  }

  throw new Error("A conexao com a db falhou!")
}