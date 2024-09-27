/* 頁面資訊 */

/* 首頁 */
export const getHomePageApi = (params) =>
  formRequest.post("/interface/web/GetHomePage", params)

/* 分類商品 */
export const getCategoryApi = (formData) =>
  $fetch("/interface/web/GetWebSubCategory", {
    method: "POST",
    body: formData
  })

/* 搜尋 */
export const getSearchApi = (formData) =>
  formDataRequest.post("/interface/web/GetProductSearch", formData)

/* 聯絡 */
export const getContactApi = (formData) =>
  $fetch("/interface/web/GetWebContact", {
    method: "POST",
    body: formData
  })
