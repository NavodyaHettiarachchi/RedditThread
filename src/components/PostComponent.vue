<template>
  <div>
    <div v-for="post in posts" :key="post.post_id" class="post">
      <div class="post-header">
        <span class="post-author">{{ post.author }}</span>
        <span class="post-timestamp">{{formatTime(post.createdDateTime)}}</span>
      </div>

      <div v-if="!post.isDeleted" class="post-content" >
        <p>{{ post.content }}</p>
      </div>
      <div v-else class="post-content">
        <p><i>{{ "--- Deleted Post ---" }}</i></p>
      </div>

      <ActionButtonComponent 
        v-if="!post.isDeleted"
        :votes="post.votes" 
        :comp_id="post.post_id" 
        :isPost="true" 
        @reply="toggleReplyInput"
      />

      <ReplyInput 
        v-if="showReply" 
        :parent_id="post.post_id"
        ariaLabel="Write Your Reply Here" 
        placeholder="Write Your Reply Here..."
        @cancel="hideReplyInput" 
      />

      <div v-if="post.comments && post.comments.length > 0" class="post-replies">
        <Comment 
          v-for="comment in post.comments" 
          :key="comment.comment_id" 
          :reply="comment" 
        />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import ActionButtonComponent from './ActionButtonComponent.vue';
import Comment from './Comment.vue';
import ReplyInput from './ReplyInput.vue';
import { formatTime } from '../utils/timeUtilts';
import { useStore } from 'vuex';

export default defineComponent({
  name: "PostComponent",
  components: {
    ActionButtonComponent,
    Comment,
    ReplyInput
  },
  setup() {
    const store = useStore();
    const posts = computed(() => store.getters['posts/getPosts']);
    const showReply = ref(false);

    const toggleReplyInput = () => {
      showReply.value = !showReply.value;
    };

    const hideReplyInput = () => {
      showReply.value = false;
    };

    return {
      posts,
      showReply,
      toggleReplyInput,
      hideReplyInput,
      formatTime
    };
  }
});
</script>

<style scoped>
.post {
  border: solid 1px #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #555;
}

.post-author {
  font-weight: bold;
}

.post-content {
  text-align: left;
  margin-bottom: 5px;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
}

.post-replies {
  margin-top: 10px;
}

</style>