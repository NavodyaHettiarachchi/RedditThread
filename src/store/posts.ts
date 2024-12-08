import { Module } from "vuex";
import { Post } from "@/interfaces/Posts";
import { Comment } from "@/interfaces/Comment";
import { sortCommentsByVotes } from "@/utils/postUtils";

interface State {
  posts: Post[];
}

const posts: Module<State, any> = {
  namespaced: true,
  state: {
    posts: [],
  },
  mutations: {
    setPosts(state, posts: Post[]) {
      state.posts = posts;
    },
    addPost(state, post: Post) {
      state.posts.push(post);
    },
    removePost(state, post_id: number) {
      const index = state.posts.findIndex((post) => post.post_id === post_id);
      if (index !== -1) {
        state.posts[index].isDeleted = true;
      }
    },
    upvotePost(state, post_id: number) {
      const post = state.posts.find((p) => p.post_id === post_id);
      if (post) post.votes++;
      state.posts = sortCommentsByVotes(state.posts);
    },
    downvotePost(state, post_id: number) {
      const post = state.posts.find((p) => p.post_id === post_id);
      if (post) post.votes--;
      state.posts = sortCommentsByVotes(state.posts);
    },
    upvoteComment(state, { comment_id, post_id }: { comment_id: number; post_id: number }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) return;

      function upvoteNestedComment(comments: any[]) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.votes++;
            return true;
          }
          if (comment.replies?.length > 0) {
            const updated = upvoteNestedComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      upvoteNestedComment(post.replies);
    },
    downvoteComment(state, { comment_id, post_id }: { comment_id: number; post_id: number }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) return;

      function downvoteNestedComment(comments: any[]) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.votes--;
            return true;
          }
          if (comment.replies?.length > 0) {
            const updated = downvoteNestedComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      downvoteNestedComment(post.replies);
    },
    deleteComment(state, { comment_id, post_id }: { comment_id: number; post_id: number }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) return;

      function findAndDeleteComment(comments: any[]) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.isDeleted = true;
            return true;
          }
          if (comment.replies?.length > 0) {
            const updated = findAndDeleteComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      findAndDeleteComment(post.replies);
    },
    addReply(state, { content, parent_id, post_id }: { content: string; parent_id: number; post_id: number }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) return;

      function findComment(comments: any[], comment_id: number): any | null {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) return comment;
          if (comment.replies?.length > 0) {
            const found = findComment(comment.replies, comment_id);
            if (found) return found;
          }
        }
        return null;
      }

      const parent = parent_id === post_id ? post : findComment(post.replies, parent_id);
      if (!parent) return;

      const newCommentId = parent_id * 100 + (parent.replies.length + 1);
      const newComment: Comment = {
        comment_id: newCommentId,
        content: content,
        postId: post_id,
        createdDateTime: new Date().toLocaleString(),
        isDeleted: false,
        votes: 0,
        replies: [],
        author: "User",
      };

      parent.replies = [...parent.replies, newComment];
    },
  },
  actions: {
    fetchPosts({ commit }) {
      const posts: Post[] =  [
        {
          post_id: 1,
          author: "User 2",
          content: "Post 1",
          votes: 0,
          isDeleted: false,
          createdDateTime: "11/15/2024, 05:39:02 AM",
          replies: [
            {
              comment_id: 101,
              author: "User3",
              content: "Comment 1 on Post 1",
              replies: [
                {
                  comment_id: 10101,
                  author: "User4",
                  content: "Comment 1 on Post 1 on Post 1",
                  replies: [
                    {
                      comment_id: 10101,
                      author: "User4",
                      content: "Comment 1 on Comment 1 on comment 1 on Post 1",
                      replies: [
                        {
                          comment_id: 1010101,
                          author: "User3",
                          content:
                            "Comment 1 on On comment 1 on Comment 2 on Post 1",
                          replies: [
                            {
                              comment_id: 101010101,
                              author: "User3",
                              content:
                                "Comment 1 on On comment 1 on Comment 2 on Post 1",
                              replies: [
                                {
                                  comment_id: 10101010101,
                                  author: "User3",
                                  content:
                                    "Comment 1 on On comment 1 on Comment 2 on Post 1",
                                  replies: [
                                    {
                                      comment_id: 1010101010101,
                                      author: "User3",
                                      content:
                                        "Comment 1 on On comment 1 on Comment 2 on Post 1",
                                      replies: [],
                                      postId: 1,
                                      votes: 0,
                                      isDeleted: false,
                                      createdDateTime: "12/06/2024, 05:39:02 AM",
                                    },
                                  ],
                                  postId: 1,
                                  votes: 0,
                                  isDeleted: false,
                                  createdDateTime: "12/06/2024, 05:39:02 AM",
                                },
                              ],
                              postId: 1,
                              votes: 0,
                              isDeleted: false,
                              createdDateTime: "12/06/2024, 05:39:02 AM",
                            },
                          ],
                          postId: 1,
                          votes: 0,
                          isDeleted: false,
                          createdDateTime: "12/06/2024, 05:39:02 AM",
                        },
                      ],
                      postId: 1,
                      votes: 0,
                      isDeleted: false,
                      createdDateTime: "11/30/2024, 05:39:02 AM",
                    },
                  ],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: "11/29/2024, 05:39:02 AM",
                },
              ],
              postId: 1,
              votes: 0,
              isDeleted: false,
              createdDateTime: "11/22/2024, 05:39:02 AM",
            },
            {
              comment_id: 102,
              author: "User3",
              content: "Comment 2 on Post 1",
              isDeleted: false,
              replies: [
                {
                  comment_id: 10201,
                  author: "User3",
                  content: "Comment 1 on Comment 2 on Post 1",
                  replies: [
                    {
                      comment_id: 1020101,
                      author: "User3",
                      content:
                        "Comment 1 on On comment 1 on Comment 2 on Post 1",
                      replies: [],
                      postId: 1,
                      votes: 0,
                      isDeleted: false,
                      createdDateTime: "12/06/2024, 05:39:02 AM",
                    },
                  ],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: "11/29/2024, 05:39:02 AM",
                },
                {
                  comment_id: 10202,
                  author: "User3",
                  content: "Comment 2 on Comment 2 on Post 1",
                  replies: [],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: "12/06/2024, 05:39:02 AM",
                },
              ],
              postId: 1,
              votes: 0,
              createdDateTime: "11/22/2024, 05:39:02 AM",
            },
          ],
        },
      ];
      commit("setPosts", posts);
    },
    addPost({ commit }, post: Post) {
      commit("addPost", post);
    },
    removePost({ commit }, post_id: number) {
      commit("removePost", post_id);
    },
    upVotePost({ commit }, post_id: number) {
      commit("upvotePost", post_id);
    },
    downVotePost({ commit }, post_id: number) {
      commit("downvotePost", post_id);
    },
    upVoteComment({ commit }, payload: { comment_id: number; post_id: number }) {
      commit("upvoteComment", payload);
    },
    downVoteComment({ commit }, payload: { comment_id: number; post_id: number }) {
      commit("downvoteComment", payload);
    },
    deleteComment({ commit }, payload: { comment_id: number; post_id: number }) {
      commit("deleteComment", payload);
    },
    replyToComment({ commit }, payload: { content: string; parent_id: number; post_id: number }) {
      commit("addReply", payload);
    },
  },
  getters: {
    getPosts(state) {
      return state.posts;
    },
    getPostsCount(state) {
      return state.posts.length;
    },
    sortedPosts(state) {
      return sortCommentsByVotes(state.posts);
    },
  },
};

export default posts;