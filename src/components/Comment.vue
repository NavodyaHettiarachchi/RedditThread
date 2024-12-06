<template>
  <div class="comment">
    <!-- Reply Header -->
    <div class="comment-header">
      <span class="comment-author">{{ reply.author }}</span>
      <span class="comment-timestamp">{{
        formatTime(reply.createdDateTime)
      }}</span>
    </div>

    <!-- Reply Content -->
    <div v-if="!reply.isDeleted" class="comment-content">
      <p>{{ reply.content }}</p>
    </div>
    <div v-else class="comment-content"> 
      <p><i>{{ "--- Deleted Reply ---" }}</i></p>
    </div>

    <div 
      v-if="!reply.isDeleted"
      class="comment-footer"
    >
      <ActionButtonComponent
        :votes="reply.votes"
        :comp_id="reply.comment_id"
        :post_id="reply.postId"
        :isPost="false"
        @reply="toggleReply"
      />
    </div>

    <ReplyInput 
      v-if="showReply"
      :parent_id="reply.comment_id"
      ariaLabel="Write Your Reply Here" 
      placeholder="Write Your Reply Here..." 
      @cancel="hideReplyInput" 
      @submit="submitInput"
    />

    <div
      v-if="reply.replies && reply.replies.length > 0"
      class="nested-comments"
    >
      <Comment 
        v-for="nestedReply in reply.replies" 
        :key="nestedReply.comment_id" 
        :reply="nestedReply" 
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import ActionButtonComponent from "./ActionButtonComponent.vue";
import ReplyInput from './ReplyInput.vue';
import { formatTime } from "../utils/timeUtilts";
import { useStore } from "vuex";

export default defineComponent({
  name: "CommentComponent",
  components: {
    ActionButtonComponent,
    ReplyInput
  },
  props: {
    reply: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const store = useStore();
    const showReply = ref(false);

    const toggleReply = () => {
      showReply.value = !showReply.value;
    };

    const hideReplyInput = () => {
      showReply.value = false;
    };

    const submitInput = async (data: { content: string, parent: number } ) => {
      await store.dispatch('posts/replyToComment', { content: data.content, parent_id: data.parent, post_id: props.reply.postId });
      showReply.value = false;
    }

    return {
      showReply,
      toggleReply,
      hideReplyInput,
      submitInput,
      formatTime
    };
  }
});
</script>

<style scoped>
.comment {
  border-left: 2px solid #ccc;
  margin-left: 20px;
  padding-left: 10px;
  margin-top: 10px;
}
.comment-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #555;
}

.comment-author {
  font-weight: bold;
}

.comment-content {
  text-align: left;
  margin-bottom: 5px;
}

.nested-comments {
  margin-top: 5px;
}
.comment-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
}
</style>