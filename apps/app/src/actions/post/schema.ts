import { z } from "zod";

export const shareLinkSchema = z.object({
  postId: z.string(),
  baseUrl: z.string(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const UpdatePostSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export const DeletePostSchema = z.object({
  id: z.string(),
});
