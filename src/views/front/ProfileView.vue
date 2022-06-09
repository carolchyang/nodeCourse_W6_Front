<template>
  <h1 class="header">修改個人資料</h1>

  <nav class="navTab">
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button
        class="nav-link active"
        id="nav-profile-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-profile"
        type="button"
        role="tab"
        aria-controls="nav-profile"
        aria-selected="true"
        @click="toggleForm('profile')"
      >
        修改資料
      </button>
      <button
        class="nav-link"
        id="nav-password-tab"
        data-bs-toggle="tab"
        data-bs-target="#nav-password"
        type="button"
        role="tab"
        aria-controls="nav-password"
        aria-selected="false"
        @click="toggleForm('password')"
      >
        重設密碼
      </button>
    </div>
  </nav>
  <div class="tab-content navTabContent" id="nav-tabContent">
    <div
      class="tab-pane fade show active px-4 py-8 px-md-8"
      id="nav-profile"
      role="tabpanel"
      aria-labelledby="nav-profile-tab"
    >
      <VForm
        v-slot="{ errors, meta }"
        id="profileForm"
        enctype="multipart/form-data"
        @submit="updateProfile"
        ref="profileForm"
      >
        <div
          class="bgCoverRounded mx-auto mb-4"
          :style="{ backgroundImage: 'url(' + profile?.photo + ')' }"
          v-if="profile?.photo"
        ></div>
        <div class="bgCoverRounded mx-auto mb-4 profileUserPhoto" v-else></div>

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
            v-model="tempProfile.photo"
            required
          ></VField>
          <error-message
            name="圖片連結"
            class="invalid-feedback text-danger"
          ></error-message>
        </div>

        <div class="mb-4">
          <label for="nickname" class="form-label">暱稱</label>
          <VField
            type="text"
            id="name"
            placeholder="請輸入暱稱"
            name="暱稱"
            class="form-control"
            :class="{ 'is-invalid': errors['暱稱'] }"
            rules="min:2"
            v-model="tempProfile.name"
            required
          ></VField>
          <error-message
            name="暱稱"
            class="invalid-feedback text-danger"
          ></error-message>
        </div>
        <div class="mb-8">
          <h3 class="mb-2 h5 fw-normal">性別</h3>
          <div class="form-check form-check-inline me-6">
            <VField
              type="radio"
              id="male"
              name="性別"
              class="form-check-input"
              value="male"
              v-model="tempProfile.gender"
            ></VField>

            <label class="form-check-label" for="male">男生</label>
          </div>
          <div class="form-check form-check-inline">
            <VField
              type="radio"
              id="female"
              name="性別"
              class="form-check-input"
              value="female"
              v-model="tempProfile.gender"
            ></VField>
            <label class="form-check-label" for="female">女生</label>
          </div>
        </div>
        <small class="d-block mb-4 text-center text-danger"></small>

        <button
          type="submit"
          class="effectBtn btn btn-primary w-100"
          :disabled="!meta.valid"
        >
          送出更新
        </button>
      </VForm>
    </div>
    <div
      class="tab-pane fade px-4 py-8 px-md-8"
      id="nav-password"
      role="tabpanel"
      aria-labelledby="nav-password-tab"
    >
      <VForm
        v-slot="{ errors, meta }"
        @submit="updatePassword"
        ref="passwordForm"
      >
        <div class="mb-4">
          <label for="password" class="form-label">密碼</label>
          <VField
            type="password"
            id="password"
            placeholder="請輸入密碼"
            name="密碼"
            class="form-control"
            :class="{ 'is-invalid': errors['密碼'] }"
            rules="required|password:8"
            v-model="tempPassword.password"
            required
          ></VField>
          <error-message
            name="密碼"
            class="invalid-feedback text-danger"
          ></error-message>
        </div>
        <div class="mb-8">
          <label for="confirmed" class="form-label">確認密碼</label>
          <VField
            type="password"
            id="confirmed"
            placeholder="請再次輸入密碼"
            name="確認密碼"
            class="form-control"
            :class="{ 'is-invalid': errors['確認密碼'] }"
            rules="required|confirmed:@密碼"
            v-model="tempPassword.confirmPassword"
            required
          ></VField>
          <error-message
            name="確認密碼"
            class="invalid-feedback text-danger"
          ></error-message>
        </div>
        <button
          type="submit"
          class="effectBtn btn btn-primary w-100"
          :disabled="!meta.valid"
        >
          重設密碼
        </button>
      </VForm>
    </div>
  </div>

  <MsgModalComponent>
    <template #default>
      <h3 class="mb-5">{{ modal.title }}</h3>
      <p class="text-gray-700">{{ modal.content }}</p>
    </template>
  </MsgModalComponent>
</template>

<script>
import { apiUpdateProfile, apiUpdatePassword } from "@/scripts/api";
import MsgModalComponent from "@/components/MsgModalComponent.vue";
import { mapState, mapActions } from "pinia";
import statusStore from "@/stores/statusStore";
import userStore from "@/stores/userStore";
import modalStore from "@/stores/modalStore";

export default {
  name: "ProfileView",
  data() {
    return {
      // 更新密碼暫存表格
      tempPassword: {
        password: "",
        confirmPassword: "",
      },
    };
  },
  methods: {
    // 切換表單
    toggleForm(name) {
      if (name == "profile") {
        this.$refs.passwordForm.resetForm();
      } else {
        this.getProfile();
      }
    },
    // 更新個人資料
    updateProfile() {
      this.toggleLoading(true);
      apiUpdateProfile(this.tempProfile)
        .then((res) => {
          // 更新用戶 data 資料
          this.updateProfileData(res.data.data.user);

          // 開啟 msgModal 提示訊息
          this.toggleMsgModal({
            title: "更新個人資料",
            content: "已成功更新您的個人資料~",
          });
          this.toggleLoading(false);
        })
        .catch((err) => {
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "更新失敗",
          });
          this.toggleLoading(false);
        });
    },
    // 更新密碼
    updatePassword() {
      this.toggleLoading(true);
      apiUpdatePassword(this.tempPassword)
        .then(() => {
          // 重置表單
          this.$refs.passwordForm.resetForm();

          // 開啟 msgModal 提示訊息
          this.toggleMsgModal({
            title: "更新密碼成功",
            content: "下次登入記得使用新密碼喔~",
          });

          this.toggleLoading(false);
        })
        .catch((err) => {
          this.pushMessage({
            style: "danger",
            content: err.response?.data?.message || "更新密碼失敗",
          });
          this.toggleLoading(false);
        });
    },
    ...mapActions(statusStore, ["pushMessage", "toggleLoading"]),
    ...mapActions(userStore, ["getProfile", "updateProfileData"]),
    ...mapActions(modalStore, ["toggleMsgModal"]),
  },
  computed: {
    ...mapState(userStore, ["profile", "tempProfile"]),
    ...mapState(modalStore, ["modal"]),
  },
  components: {
    MsgModalComponent,
  },
};
</script>

<style lang="scss">
.profileUserPhoto {
  background-image: url("@/assets/images/user_default.png");
}
</style>
