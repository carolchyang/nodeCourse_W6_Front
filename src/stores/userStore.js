import router from "@/router";
import { defineStore } from "pinia";
import { apiGetProfile } from "@/scripts/api";
import statusStore from "./statusStore";
import { clearToken } from "@/scripts/methods";

const status = statusStore();

export default defineStore("userStore", {
  state: () => {
    return {
      // 個人資料
      profile: {
        name: "",
        photo: "",
        gender: "",
        _id: "",
      },
      // 個人資料暫存表格
      tempProfile: {
        name: "",
        photo: "",
        gender: "",
        _id: "",
      },
    };
  },
  actions: {
    // 取得用戶資料
    getProfile() {
      status.isLoading = true;
      apiGetProfile()
        .then((res) => {
          this.profile = Object.assign({}, res.data.data);
          this.tempProfile = Object.assign({}, res.data.data);
          status.isLoading = false;
        })
        .catch((err) => {
          status.pushMessage({
            style: "danger",
            content:
              err.response?.data?.message || "取得個人資料失敗，請重新登入",
          });
          status.isLoading = false;

          // 若驗證個人資料失敗則強制登出
          clearToken();
          router.push("/signin");
        });
    },
    // 更新 profile 資料
    updateProfileData(data) {
      this.profile = Object.assign({}, data);
      this.tempProfile = Object.assign({}, data);
    },
  },
});
