import { ObjectId } from "mongodb";

export interface post{
  _id?: ObjectId;
  descricao: string;
  imgUrl: string;
  alt: string;
}