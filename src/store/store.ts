import { createStore } from 'vuex';
import posts from './posts';

const store = createStore({
  modules: {
    posts,
  }
});

export default store;