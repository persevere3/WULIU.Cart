/* 登入 商店 */
export const storeLoginApi = (query) =>
  $fetch("/interface/store/UserLogin", {
    method: "POST",
    query
  })

/* 查 web 資訊 */
export const initialWebApi = (query) =>
  $fetch("/interface/web/InitialWeb", {
    query
  })
// useFetch("/interface/web/InitialWeb", {
//   query
// })

/*  */
export const connectHandlerApi = (formData) =>
  $fetch("/interface/web/PostFeedback", {
    method: "POST",
    body: formData
  })

/* 查 cart store 資訊 */
export const ajaxStoreApi = (query) =>
  $fetch("/interface/store/getStore", {
    method: "POST",
    query
  })
