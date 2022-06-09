<template>
  <div class="row g-3 mb-4">
    <div class="col-12 col-md-4">
      <select
        class="form-select form-select-sm"
        v-model="sort"
        @change="getPosts()"
      >
        <option value="desc">由新到舊</option>
        <option value="asc">由舊到新</option>
      </select>
    </div>
    <div class="col-12 col-md-8">
      <div class="input-group input-group-sm">
        <input
          type="text"
          class="form-control"
          placeholder="搜尋貼文"
          aria-label="search"
          aria-describedby="search"
          v-model.trim="keyword"
        />
        <button
          class="effectBtn btn btn-primary py-0 px-3"
          type="button"
          id="search"
          @click.prevent="getPosts()"
        >
          <i class="bi bi-search h3"></i>
        </button>
      </div>
    </div>
  </div>

  <ArticleComponent :data="posts" v-if="posts?.length"></ArticleComponent>

  <EmptyCardComponent v-else>
    <template #default>目前尚無動態，新增一則貼文吧！</template>
  </EmptyCardComponent>

  <DelModalComponent @del-data="delPost">
    <template #default>
      <p class="d-md-inline-block mb-3 mb-md-0">
        確定要刪除此則
        <b class="text-danger">{{ modal.title }}</b>
        ？
      </p>
      <span>（刪除後無法回復）</span>
    </template>
  </DelModalComponent>
</template>

<script>
import ArticleComponent from "@/components/ArticleComponent.vue";
import EmptyCardComponent from "@/components/EmptyCardComponent.vue";
import DelModalComponent from "@/components/DelModalComponent.vue";
import { mapState, mapActions } from "pinia";
import statusStore from "@/stores/statusStore";
import modalStore from "@/stores/modalStore";
import { apiGetPosts, apiDelPost } from "@/scripts/api";

export default {
  name: "DynamicWallView",
  data() {
    return {
      keyword: "",
      sort: "desc",
      posts: [],
      pagination: {},
    };
  },
  methods: {
    // 取得貼文
    getPosts() {
      let tempData = {
        // 排序順序 1 新到舊 asc 舊到新
        sort: this.sort,
        // 關鍵字篩選 若沒有則返回所有貼文
        keyword: this.keyword,
      };

      this.toggleLoading(true);

      apiGetPosts(tempData)
        .then((res) => {
          this.posts = res.data.data;
          this.toggleLoading(false);
        })
        .catch((err) => {
          this.toggleLoading(false);
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "取得貼文失敗",
          });
        });
    },
    // 刪除貼文
    delPost() {
      this.toggleLoading(true);
      apiDelPost(this.modal.id)
        .then((res) => {
          this.posts = res.data.data;
          this.closeDelModal();
          this.toggleLoading(false);
          this.pushMessage({
            style: "dark",
            content: "刪除貼文成功",
          });
        })
        .catch((err) => {
          this.closeDelModal();
          this.toggleLoading(false);
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "刪除貼文失敗",
          });
        });
    },
    ...mapActions(statusStore, ["toggleLoading", "pushMessage"]),
    ...mapActions(modalStore, ["closeDelModal"]),
  },
  computed: {
    ...mapState(modalStore, ["modal"]),
  },
  components: {
    ArticleComponent,
    EmptyCardComponent,
    DelModalComponent,
  },
  created() {
    this.getPosts();
  },
};
</script>
