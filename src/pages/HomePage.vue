<template>
  <ReplyInput 
    placeholder="Type your post here ..."
    ariaLabel="Write your post here"
    @cancel="handleCancel"
    @submit="submitPost"
  />
  <PostComponent />
</template>

<script lang="ts">
import ReplyInput from '../components/ReplyInput.vue';
import PostComponent from '@/components/PostComponent.vue';
import { Post } from '@/interfaces/Posts';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: "HomePage",
  components: {
    ReplyInput,
    PostComponent,
  },
  setup() {
    const store = useStore();

    // Fetch Posts
    store.dispatch('posts/fetchPosts');

    // Use a computed property for total posts
    const totalPosts = computed(() => store.getters['posts/getPostsCount']);

    const handleCancel = () => {
      console.log('Cancelled input.');
    };

    const submitPost = (content: { content: string, parent: number }) => {
      const newPost: Post = {
        post_id: totalPosts.value + 1,
        author: 'User 2',
        content: content.content,
        votes: 0,
        replies: [],
        isDeleted: false,
        createdDateTime: new Date().toLocaleString(),
      };
      
      store.dispatch('posts/addPost', newPost);
    };

    return {
      // Reactive Variables
      totalPosts,

      // Methods
      handleCancel,
      submitPost,
    };
  }
});
</script>