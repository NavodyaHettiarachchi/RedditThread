import { Comment } from '@/interfaces/Comment';

export interface Post {
  post_id: number;
  content: string;
  author: string;
  replies: Comment[];
  votes: 0,
  createdDateTime: string;
  isDeleted: boolean;
}