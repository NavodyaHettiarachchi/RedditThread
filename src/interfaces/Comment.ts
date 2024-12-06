export interface Comment {
  comment_id: number;
  author: string; 
  content: string;
  replies: Comment[];
  postId: number;
  votes: number;
  isDeleted: boolean;
  createdDateTime: string;
};