import express from "express";
import { getTodosPosts, criarPost, upload, atualizarPost } from "../services/postService";
import { ObjectId } from "mongodb";
import { post } from "../models/postModel";

const routes = (app: express.Application) => {
  app.use(express.json());

  app.get("/posts", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const posts = await getTodosPosts();
      res.json(posts);
    } catch (err: any){
      console.log(err.message);
      res.status(500).json({erro: "Erro ao buscar os posts..."});
    }
  });

  app.post("/posts", 
    upload.single("imagem"),
    async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      if(!req.file){
        res.status(400).json({erro: "Imagem é obrigatória!"})
        return;
      }

      const {descricao, alt} = req.body;

      const novoPost = await criarPost(
        {descricao, alt, imgUrl: ""},
        `/uploads/${req.file.filename}`
      );

      res.status(201).json({message: "Post criado com sucesso!"});
    } catch (err: any) {
      console.error("Houve um erro ao acessar a rota: ",err.message);
      res.status(500).json({erro: "Houve um erro ao criar o post, tente novamente mais tarde."});
    }
  });

  app.put("/posts/:id", 
    upload.single("imagem"),
    async (req: express.Request, res: express.Response): Promise<void> => {
      try{
        const id = new ObjectId(req.params.id);
        
        const post = await atualizarPost(id);
      } catch (err: any) {
        console.error("Houve um erro ao atualizar o post: ",err.message);
        res.status(500).json({erro: "Erro ao atualizar o post"});
      };
    }
  );
}

export default routes;