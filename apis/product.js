/* 查 商品分類 */
export const getCategoriesApi = (query) =>
  $fetch("/interface/store/GetCategory", {
    method: "POST",
    query
  })

/* 查 商品 */
export const getProductsApi = (query) =>
  $fetch("/interface/store/storeLogin", {
    method: "POST",
    query
  })

/* 查 加價購商品 */
export const getAddProductsApi = (formData) =>
  $fetch("/interface/store/GetAdditional", {
    method: "POST",
    body: formData
  })

/* 查 商品庫存 */
export const getAmountApi = (query) =>
  $fetch("/interface/store/GetProductQty", {
    method: "POST",
    query
  })
