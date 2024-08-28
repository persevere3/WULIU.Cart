/* 頁面資訊 */

/*
  首頁
  let params = return_formUrlencoded('WebPreview')
*/
export const getHomePageApi = (params) =>
  formRequest.post("/interface/web/GetHomePage", params)

/*
  分類商品
  let obj = {
    id,
    WebPreview: site.value.WebPreview
  }
  let formData = return_formData(obj)
*/
export const getCategoryApi = (formData) =>
  formDataRequest.post("/interface/web/GetWebSubCategory", formData)

/* 
  搜尋
  getSearchApi
  let obj = {
    input: state.search_title,
    type: state.sortBy_index,
    WebPreview: site.value.WebPreview
  }
  let formData = return_formData(obj)
*/
export const getSearchApi = (formData) =>
  formDataRequest.post("/interface/web/GetProductSearch", formData)

/* 
  聯絡
  let params = return_formUrlencoded('WebPreview')
*/
export const getContactApi = (params) =>
  formRequest.post("/interface/web/GetWebContact", params)
