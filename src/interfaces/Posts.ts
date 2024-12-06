import { Comment } from '@/interfaces/Comment';

export interface Post {
  post_id: number;
  content: string;
  author: string;
  comments: Comment[];
  votes: 0,
  createdDateTime: string;
  isDeleted: boolean;
}