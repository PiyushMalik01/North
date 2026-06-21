import { z } from 'zod';

export const createPostSchema = z.object({
  communitySlug: z.string().min(1),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
});

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().nullish(),
  body: z.string().min(1).max(2000),
});

export const voteSchema = z
  .object({
    postId: z.string().optional(),
    commentId: z.string().optional(),
    value: z.number().int().min(-1).max(1),
  })
  .refine((v) => !!v.postId !== !!v.commentId, 'Provide exactly one of postId or commentId');

export const sendMessageSchema = z.object({
  body: z.string().min(1).max(4000),
  clientId: z.string().optional(),
});

export const readSchema = z.object({ messageId: z.string().min(1) });
