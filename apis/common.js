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

/*  */
export const connectHandlerApi = (query) =>
  $fetch("/interface/web/PostFeedback", {
    method: "POST",
    query
  })

/* 查 cart store 資訊 */
export const ajaxStoreApi = (query) =>
  $fetch("/interface/store/getStore", {
    method: "POST",
    query
  })
