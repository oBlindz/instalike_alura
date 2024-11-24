import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function gerarDescricaoEAlt(imagePath: string): Promise<{descricao: string} | null>{
  try {
    const model = genAI.getGenerativeModel({model: "gemini-1.5-flash"});
    const prompt = `Gere uma descrição da seguinte imagem: ${imagePath}, eu quero somente a descrição dessa imagem, evite gerar textos extras ou meros comentários, quero somente a DESCRIÇÃO DA IMAGEM e isso é muito importante! Outra coisa, não precisa falar "a imagem" apenas fale sobre ela de forma divertida e BREVE!`;

    const result = await model.generateContent(prompt);

    return {
      descricao: result.response.text(),
    }
  } catch (err){
    console.error("Erro ao se comunicar com o Gemini: ",err);
    return null;
  }
}