<template>
  <h1 class="header">張貼動態</h1>

  <VForm
    v-slot="{ errors, meta }"
    class="card p-md-8"
    @submit="createPost"
    ref="postForm"
  >
    <div class="mb-4">
      <label for="content" class="form-label">貼文內容</label>
      <VField
        type="text"
        id="content"
        placeholder="輸入您的貼文內容"
        name="貼文內容"
        class="form-control"
        :class="{ 'is-invalid': errors['貼文內容'] }"
        rows="5"
        rules="required|max:200"
        v-model="tempPost.content"
        as="textarea"
      ></VField>
      <error-message
        name="貼文內容"
        class="invalid-feedback text-danger"
      ></error-message>
    </div>
    <div class="mb-4">
      <label for="photo" class="form-label">圖片連結</label>
      <VField
        type="text"
        id="photo"
        placeholder="請輸入圖片連結"
        name="圖片連結"
        class="form-control"
        :class="{ 'is-invalid': errors['圖片連結'] }"
        rules="url"
        v-model="tempPost.image"
        required
      ></VField>
      <error-message
        name="圖片連結"
        class="invalid-feedback text-danger"
      ></error-message>
    </div>

    <div class="text-center">
      <button
        type="submit"
        class="effectBtn btn btn-primary w-100"
        :disabled="!meta.valid"
      >
        送出貼文
      </button>
    </div>
  </VForm>
</template>

<script>
import { mapActions } from "pinia";
import statusStore from "@/stores/statusStore";
import { apiCreatePost } from "@/scripts/api";

export default {
  name: "CreatePostView",
  data() {
    return {
      tempPost: {
        content: "",
        image: "",
      },
    };
  },
  methods: {
    // 建立貼文
    createPost() {
      this.toggleLoading(true);
      apiCreatePost(this.tempPost)
        .then(() => {
          this.toggleLoading(false);
          this.pushMessage({
            style: "dark",
            content: "已建立貼文",
          });
          this.$router.push("/");
        })
        .catch((err) => {
          this.toggleLoading(false);
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "建立貼文失敗",
          });
        });
    },
    ...mapActions(statusStore, ["toggleLoading", "pushMessage"]),
  },
};
</script>

<style lang="scss" scoped>
.cardCloseBtn {
  color: red;
  font-size: 1.5rem;
  &:hover {
    transform: scale(1.25);
  }
}
</style>
