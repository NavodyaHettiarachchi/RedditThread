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
        v-for="(nestedReply) in visibleReplies"
        :key="nestedReply.comment_id" 
        :reply="nestedReply" 
      />
      <button
        v-if="hasMoreReplies"
        class="load-more-button"
        @click="loadMoreReplies"
      >
        Load More Replies
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
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

    const visibleRepliesCount = ref(2);

    const visibleReplies = computed(() => {
      return limitNestedReplies(props.reply.replies, visibleRepliesCount.value);
    });

    function limitNestedReplies(replies: any[], visibleCount: number): any[] {
      return replies.slice(0, visibleCount).map((reply) => ({
        ...reply,
        replies: reply.replies ? limitNestedReplies(reply.replies, visibleCount) : [],
      }));
    }

    const hasMoreReplies = computed(() =>
      props.reply.replies.length > visibleRepliesCount.value
    );


    const loadMoreReplies = () => {
      visibleRepliesCount.value += 2;
    };

    const toggleReply = () => {
      showReply.value = !showReply.value;
    };

    const hideReplyInput = () => {
      showReply.value = false;
    };

    const submitInput = async (data: { content: string; parent: number }) => {
      await store.dispatch("posts/replyToComment", {
        content: data.content,
        parent_id: data.parent,
        post_id: props.reply.postId,
      });
      showReply.value = false;
    };

    return {
      showReply,
      toggleReply,
      hideReplyInput,
      submitInput,
      visibleReplies,
      hasMoreReplies,
      loadMoreReplies,
      formatTime,
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

.load-more-button {
  margin-top: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.load-more-button:hover {
  background-color: #0056b3;
}
</style>