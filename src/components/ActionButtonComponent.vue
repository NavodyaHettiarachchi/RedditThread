<template>
  <div class="post-footer">
    <div class="vote-section">
      <button class="icon-button round" @click="upvote(comp_id)">
        👍
      </button>
      <p class="votes">{{ votes }}</p>
      <button class="icon-button round" @click="downvote(comp_id)">
        👎
      </button>
    </div>
    <div class="action-section">
      <button class="icon-button reply-button" @click="replyToItem(comp_id)">
        Reply
      </button>
      <button class="icon-button delete-button" @click="deleteItem(comp_id)">
        🗑️ Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: "ActionButtonComponent",
  emits: ['reply'],
  props: {
    votes: {
      type: Number,
      required: true,
      default: 0,
    },
    comp_id: {
      type: Number,
      required: true,
    },
    isPost: {
      type: Boolean,
      required: true
    },
    post_id: {
      type: Number,
      required: false,
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    
    const upvote = async (comp_id: number) => {
      if (props.isPost) {
        await store.dispatch('posts/upVotePost', comp_id);
      } else {
        await store.dispatch('posts/upVoteComment', { comment_id: comp_id, post_id: props.post_id });
      }
    };

    const downvote = async (comp_id: number) => {
      if (props.isPost) {
        await store.dispatch('posts/downVotePost', comp_id);
      } else {
        await store.dispatch('posts/downVoteComment', { comment_id: comp_id, post_id: props.post_id });
      }
    };

    const deleteItem = async (comp_id: number) => {
      if (props.isPost) {
        await store.dispatch('posts/removePost', comp_id);
      } else {
        await store.dispatch('posts/deleteComment', { comment_id: comp_id, post_id: props.post_id });
      }
    }

    const replyToItem = (comp_id: number) => {
      emit('reply', { parent_id: comp_id } );
    }

    return {
      // Props

      upvote,
      downvote,
      replyToItem,
      deleteItem,
    }
  }
})
</script>

<style scoped>
/* Post Footer */
.post-footer {
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  padding: 0;
}

/* Vote Section */
.vote-section {
  display: flex;
  align-items: center; 
  gap: 5px; 
}

.votes {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.action-section {
  display: flex;
  align-items: center; 
  gap: 5px; 
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #555;
  transition: color 0.2s ease;
}

.icon-button:hover {
  color: #007bff;
}

.round {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 18px;
}

.reply-button {
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.reply-button::before {
  content: '💬';
  font-size: 16px;
}

.delete-button {
  color: #d9534f;
}

.delete-button:hover {
  color: #c9302c;
}
</style>