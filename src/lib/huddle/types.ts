/** Shared DTOs for the huddle API — used by both route handlers and the frontend. */

export interface HuddleUser {
  id: string;
  name: string;
}

export interface CommunityDTO {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  postCount: number;
  joined: boolean;
}

export interface PostDTO {
  id: string;
  title: string;
  body: string;
  score: number;
  myVote: number; // -1 | 0 | 1
  createdAt: string;
  author: HuddleUser;
  community: { slug: string; name: string };
  commentCount: number;
}

export interface CommentDTO {
  id: string;
  body: string;
  score: number;
  myVote: number;
  createdAt: string;
  author: HuddleUser;
  parentId: string | null;
  replies: CommentDTO[];
}

export interface ThreadDTO {
  id: string;
  type: 'DM' | 'GROUP';
  title: string;
  lastMessageAt: string;
  preview: string | null;
  unread: boolean;
  participants: HuddleUser[];
}

export interface MessageDTO {
  id: string;
  body: string;
  senderId: string;
  senderName: string;
  createdAt: string;
  clientId?: string | null;
  pending?: boolean; // client-only: optimistic message not yet confirmed
}

export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}
