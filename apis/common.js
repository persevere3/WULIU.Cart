/* 登入 商店
  const site = JSON.parse(localStorage.getItem("site")) || {}
    let query = {
      site: site.Site,
      store: site.Name,
      Preview: site.Preview,
      WebPreview: site.WebPreview
    }
*/
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

/* 查 cart 資訊 */
export const initialCartApi = () => $fetch("/interface/store/InitialStore")

/* 查 cart store 資訊
  let query = {
    Preview: site.value.Preview
  }
*/
export const ajaxStoreApi = (query) =>
  $fetch("/interface/store/getStore", {
    method: "POST",
    query
  })
