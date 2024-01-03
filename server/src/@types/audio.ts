import { AudioDocument } from "#/models/audio";
import { Request } from "express";
import { ObjectId } from "mongoose";

export type PopulatedFavList = AudioDocument<{
  _id: ObjectId;
  name: string;
  email: string;
}>;

export interface CreatePlayListRequest extends Request {
  body: {
    title: string;
    audioId: string;
    visibility: "public" | "private";
  };
}
export interface UpdatePlayListRequest extends Request {
  body: {
    title: string;
    audio: string;
    id: string;
    visibility: "public" | "private";
  };
}
