<template>
  <!-- 單一頁面不給刪除 postId 用來判定是否可以刪除 -->
  <ArticleComponent
    :postId="postId"
    :data="posts"
    v-if="posts?.length"
  ></ArticleComponent>

  <EmptyCardComponent v-else>
    <template #default>此貼文已被刪除！</template>
  </EmptyCardComponent>
</template>

<script>
import ArticleComponent from "@/components/ArticleComponent.vue";
import EmptyCardComponent from "@/components/EmptyCardComponent.vue";
import { mapActions } from "pinia";
import statusStore from "@/stores/statusStore";
import { apiGetPost } from "@/scripts/api";

export default {
  name: "SinglePostView",
  data() {
    return {
      posts: [],
      postId: "",
    };
  },
  methods: {
    // 取得單一貼文
    getPost() {
      this.toggleLoading(true);
      apiGetPost(this.postId)
        .then((res) => {
          this.posts[0] = res.data.data;
          this.toggleLoading(false);
        })
        .catch((err) => {
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "取得貼文失敗",
          });
          this.toggleLoading(false);
        });
    },
    ...mapActions(statusStore, ["toggleLoading", "pushMessage"]),
  },
  components: {
    ArticleComponent,
    EmptyCardComponent,
  },
  created() {
    this.postId = this.$route.params.id;
    this.getPost();
  },
};
</script>
