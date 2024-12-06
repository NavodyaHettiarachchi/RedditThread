import { Module } from "vuex";
import { Post } from "@/interfaces/Posts";
import { Comment } from "@/interfaces/Comment";

interface State {
  posts: Post[];
}

const posts: Module<State, any> = {
  namespaced: true, // Ensure the module is namespaced
  state: {
    posts: [],
  },
  actions: {
    fetchPosts({ commit }) {
      const posts: Post[] = [
        {
          post_id: 1,
          author: 'User 2',
          content: 'This is a posts',
          votes: 0,
          isDeleted: false,
          createdDateTime: '11/15/2024, 05:39:02 AM',
          comments: [
            {
              comment_id: 101,
              author: 'User3',
              content: 'Another top-level comment.',
              replies: [
                {
                  comment_id: 10101,
                  author: 'User4',
                  content: 'Another second-level comment.',
                  replies: [],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: '11/29/2024, 05:39:02 AM',
                }
              ],
              postId: 1,
              votes: 0,
              isDeleted: false,
              createdDateTime: '11/22/2024, 05:39:02 AM',
            },
            {
              comment_id: 102,
              author: 'User3',
              content: 'Another top-level comment.',
              isDeleted: false,
              replies: [
                {
                  comment_id: 10201,
                  author: 'User3',
                  content: 'Another second-level comment.',
                  replies: [
                    {
                      comment_id: 1020101,
                      author: 'User3',
                      content: 'Another top-level comment.',
                      replies: [],
                      postId: 1,
                      votes: 0,
                      isDeleted: false,
                      createdDateTime: '12/06/2024, 05:39:02 AM',
                    }
                  ],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: '11/29/2024, 05:39:02 AM',
                },
                {
                  comment_id: 10202,
                  author: 'User3',
                  content: 'Another top-level comment.',
                  replies: [],
                  postId: 1,
                  votes: 0,
                  isDeleted: false,
                  createdDateTime: '12/06/2024, 05:39:02 AM',
                }
              ],
              postId: 1,
              votes: 0,
              createdDateTime: '11/22/2024, 05:39:02 AM',
            }
          ],
        },
      ];
      commit('setPosts', posts);
    },
    addPost({ commit, state }, post: Post) {
      commit('addPost', post);
    },
    removePost({ commit, state }, post_id: number) {
      console.log("remove post: ", post_id);
      commit('removePost', post_id);  
    },
    upVotePost({ commit, state }, post_id: number) {
      commit('upvote', post_id);
    },
    downVotePost({ commit, state }, post_id: number) {
      commit('downvote', post_id);
    },
    upVoteComment({ commit, state }, { comment_id, post_id }) {
      commit('upvoteComment', { comment_id, post_id });
    },
    downVoteComment({ commit, state }, { comment_id, post_id }) {
      commit('downVoteComment', { comment_id, post_id });
    },
    deleteComment({ commit, state }, { comment_id, post_id }) {
      commit('deleteComment', { comment_id, post_id });
    },
    replyToComment({ commit, state }, { content, parent_id, post_id }) {
      function findComment(comments: any[], comment_id: number): any | null {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies, comment_id);
            if (found) return found;
          }
        }
        return null;
      }
    
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) {
        console.error("Post not found");
        return;
      }
    
      let parent = null;
      if (parent_id === post_id) {
        parent = post;
      } else {
        parent = findComment(post.comments, parent_id);
      }
    
      if (!parent) {
        console.error("Parent not found");
        return;
      }
    
      const newCommentId = parent_id * 100 + (parent.replies.length + 1);
    
      const newComment: Comment = {
        comment_id: newCommentId,
        content: content,
        postId: post_id,
        createdDateTime: new Date().toLocaleString(),
        isDeleted: false,
        votes: 0,
        replies: [],
        author: 'User'
      };
    
      commit('addReply', { parent_id, post_id, reply: newComment });
    }    
  },
  mutations: {
    setPosts(state, posts: Post[]) {
      state.posts = posts;
    },
    addPost(state, post: Post) {
      state.posts.push(post);
    },
    removePost(state, post_id: number) {
      console.log("remove post mutation: ", post_id);
      const index = state.posts.findIndex((post: Post) => post.post_id == post_id);
      state.posts[index].isDeleted = true;
    },
    upvote(state, post_id: number) {
      const index = state.posts.findIndex((post: Post) => post.post_id === post_id);
      state.posts[index].votes += 1;
    },
    downvote(state, post_id: number) {
      const index = state.posts.findIndex((post: Post) => post.post_id === post_id);
      state.posts[index].votes -= 1;
    },
    upvoteComment(state, { comment_id, post_id }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) {
        console.error("Post not found");
        return;
      }

      function upvoteNestedComment(comments: any) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.votes += 1;
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            const updated = upvoteNestedComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      upvoteNestedComment(post.comments);
    },
    downVoteComment(state, { comment_id, post_id }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) {
        console.error("Post not found");
        return;
      }

      function downvoteNestedComment(comments: any) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.votes -= 1;
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            const updated = downvoteNestedComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      downvoteNestedComment(post.comments);
    },
    deleteComment(state, { comment_id, post_id }) {
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) {
        console.error("Post not found");
        return;
      }

      function findAndDeleteComment(comments: any) {
        for (const comment of comments) {
          if (comment.comment_id === comment_id) {
            comment.isDeleted = true;
            console.log('Found it: ', comment.comment_id)
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            const updated = findAndDeleteComment(comment.replies);
            if (updated) return true;
          }
        }
        return false;
      }

      findAndDeleteComment(post.comments);
    },
    addReply(state, { parent_id, post_id, reply }) {
      function addReplyToTree(comments: any[], parent_id: number): boolean {
        for (const comment of comments) {
          if (comment.comment_id === parent_id) {
            comment.replies.push(reply);
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            const added = addReplyToTree(comment.replies, parent_id);
            if (added) return true;
          }
        }
        return false;
      }
    
      const post = state.posts.find((post) => post.post_id === post_id);
      if (!post) {
        console.error("Post not found");
        return;
      }
    
      if (parent_id === post_id) {
        post.comments.push(reply);
      } else {
        addReplyToTree(post.comments, parent_id);
      }
    },    
  },
  getters: {
    getPosts: (state) => state.posts,
    getPostsCount: (state) => {
      return state.posts.length;
    },
  },
};

export default posts;
