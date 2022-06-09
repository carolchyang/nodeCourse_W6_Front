import axios from "axios";

const api = process.env.VUE_APP_API;

// Users
export const apiUserSignUp = (data) => axios.post(`${api}/user/sign_up`, data);
export const apiUserSignIn = (data) => axios.post(`${api}/user/sign_in`, data);
export const apiUpdatePassword = (data) =>
  axios.post(`${api}/user/updatePassword`, data);
export const apiGetProfile = () => axios.get(`${api}/user/profile`);
export const apiUpdateProfile = (data) =>
  axios.patch(`${api}/user/profile`, data);

// Post
export const apiGetPosts = (data) =>
  axios.get(`${api}/posts`, { params: data });
export const apiGetPost = (id) => axios.get(`${api}/post/${id}`);
export const apiCreatePost = (data) => axios.post(`${api}/post`, data);
export const apiDelPost = (id) => axios.delete(`${api}/post/${id}`);
