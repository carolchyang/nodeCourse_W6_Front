<template>
  <ul class="mb-10">
    <li class="card customList" v-for="item in data" :key="item._id">
      <div class="d-flex align-items-center mb-4">
        <a href="#" class="cardImgLink">
          <img
            :src="item.user?.photo"
            class="thumbnail thumbnail-xl"
            v-if="item.user?.photo"
          />
          <img
            src="../assets/images/user_default.png"
            class="thumbnail thumbnail-xl"
            v-else
          />
        </a>
        <div class="fw-bold ms-4">
          {{ item.user?.name }}
          <span class="d-block mt-1 text-light fs-7 fw-normal">
            {{ $getTime(item.createdAt) }}
          </span>
        </div>

        <!-- 若為此登入者所發的文 && postId 沒有值 - 非單一貼文頁面 -->
        <a
          href="#"
          class="cardCloseBtn"
          @click.prevent="delData(item._id, 'delpost')"
          v-if="profile._id === item.user?._id && !postId"
        >
          <i class="bi bi-x-lg"></i>
        </a>
      </div>
      <div class="mb-5">
        <p class="mb-4 text-break">
          {{ item.content }}
        </p>
        <div
          class="bgCover mb-4"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
          v-if="item.image"
        ></div>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from "pinia";
import modalStore from "@/stores/modalStore";
import userStore from "@/stores/userStore";

export default {
  name: "ArticleComponent",
  props: ["data", "postId"],
  methods: {
    // 開啟 DelModal
    delData(id, delItem) {
      const modal = {
        type: delItem,
        id,
        title: delItem == "delpost" ? "貼文" : "留言",
        content: "",
      };
      this.toggleDelModal(modal);
    },
    ...mapActions(modalStore, ["toggleDelModal"]),
  },
  computed: {
    ...mapState(userStore, ["profile"]),
  },
};
</script>
