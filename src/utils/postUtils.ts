export function sortCommentsByVotes(comments: any): any {
  return comments
    .map((comment: { replies: any; }) => ({
      ...comment,
      replies: sortCommentsByVotes(comment.replies),
    }))
    .sort((a: { votes: number; }, b: { votes: number; }) => b.votes - a.votes);
}