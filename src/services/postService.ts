import multer from "multer";
import path from "path";
import { post } from "../models/postModel";
import { conectarAoBanco } from "../config/dbConfig";
import { ObjectId } from "mongodb";
import { gerarDescricaoEAlt } from "./geminiService";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: (req, file, cb) => {
    const unifiqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unifiqueSuffix + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if(allowedTypes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não suportado!"));
    }
  },
});

export async function getTodosPosts(): Promise<post[]>{
  try{
    const db = await conectarAoBanco();
    const posts = await db.collection<post>("posts").find().toArray();
    return posts
  } catch (err) {
    console.error("Houve um erro ao buscar todos os posts", err);
    throw err;
  }
}

export async function criarPost(novoPost: post, filePath: string): Promise<post>{
  try{
    const db = await conectarAoBanco();

    const result = await db.collection<post>("posts").insertOne({
      ...novoPost,
      imgUrl: filePath,
      descricao: "Processando...",
    });

    if(!result.acknowledged){
      throw new Error("Erro ao inserir post na base de dados!");
    }

    console.log("Post criado com sucesso!");
    return {
      ...novoPost,
      _id: result.insertedId,
      imgUrl: filePath,
    };
  } catch (err: any) {
    console.error("Houve um erro ao criar o post: ",err.message);
    throw err;
  };
}

export async function getPostPorId(id: string): Promise<post | null>{
  try{
    const db = await conectarAoBanco();
    const post = await db.collection<post>("posts").findOne({_id: new ObjectId(id)});
    return post;
  } catch (err: any) {
    console.error("Houve um erro ao buscar o ID dessa postagem", err.message);
    throw new Error("Erro ao buscar o post pelo ID");
  }
} 

export async function atualizarPost(id: ObjectId): Promise<post | null>{
  try{
    const db = await conectarAoBanco();
    const post = await db.collection<post>("posts").findOne({_id: id});
    if(!post){
      console.error("Post não encontrado");
      return null;
    }

    const descricao = await gerarDescricaoEAlt(post.imgUrl);
    if(!descricao){
      console.error("Descrição não encontrada");
      return null
    }

    const result = await db.collection<post>("posts").findOneAndUpdate(
      {_id: id},
      {$set: descricao},
      {returnDocument: "after"}
    );

    if(!result){
      console.error("Não foi possível atualizar o post");
      return null;
    };

    return result;

  } catch (err: any) {
    console.error("Houve um erro ao atualizar o post: ",err.message);
    throw new Error("Houve um erro ao atualizar o post");
  }
}