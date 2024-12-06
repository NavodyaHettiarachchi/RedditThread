<template>
  <div class="reply-input">
    <textarea
      v-model="inputContent"
      :placeholder="placeholder"
      maxlength="800"
      :aria-label="ariaLabel"
    ></textarea>
    <p class="char-count">{{ charCount }}/ 800</p>
    <div class="actions">
      <button @click="clearInput">Clear</button>
      <button @click="cancelInput">Cancel</button>
      <button @click="submitInput" :disabled="!inputContent.trim()">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
export default defineComponent({
  name: "ReplyInput",
  emits: ['cancel', 'submit'],
  props: {
    placeholder: {
      type: String,
    },
    ariaLabel: {
      type: String,
    },
    parent_id: {
      type: Number
    }
  },
  setup(props, { emit }) {
    //
    const inputContent = ref<string>("");
    const charCount = computed<number>(() => inputContent.value.length);

    // Methods
    const clearInput = () => {
      inputContent.value = "";
    };

    const cancelInput = () => {
      clearInput();
      emit('cancel');
    };

    const submitInput = () => {
      if (inputContent.value.trim()) {
        emit('submit', { content: inputContent.value.trim(), parent: props.parent_id });
        clearInput();
      }
    }

    return {
      // Variables
      inputContent,
      charCount,

      // Methods
      clearInput,
      cancelInput,
      submitInput,
    };
  },
})
</script>

<style scoped>
.reply-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  margin-bottom: 8px;
}

textarea {
  min-width: 400px;
  min-height: 40px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #888;
  position: absolute;
  left: 0;
  bottom: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:not(:disabled) {
  background-color: #007bff;
  color: white;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}
</style>