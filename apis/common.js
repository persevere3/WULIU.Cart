/* 登入 商店 */
export const storeLoginApi = (formData) =>
  $fetch("/interface/store/UserLogin", {
    method: "POST",
    body: formData
  })

/* 查 web 資訊 */
export const initialWebApi = (query) => {
  // process.server: server render 時執行
  if (process.server)
    return $fetch("/interface/web/InitialWeb", {
      query
    })
  else
    return $fetch("/interface/web/InitialWeb", {
      query
    })
}

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
