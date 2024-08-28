/* 查 商品分類
  let query = {
    Preview: commonStore.site.Preview
  }
*/
export const getCategoriesApi = (query) =>
  $fetch("/interface/store/GetCategory", {
    method: "POST",
    query
  })

/* 查 商品
  let query = {
    Preview: commonStore.site.Preview
  }
*/
export const getProductsApi = (query) =>
  $fetch("/interface/store/storeLogin", {
    method: "POST",
    query
  })

/* 查 加價購商品
  let id = ids.join()
  let query = {
    id,
    Preview: commonStore.site.Preview
  }
*/
export const getAddProductsApi = (query) =>
  $fetch("/interface/store/GetAdditional", {
    method: "POST",
    query
  })

/* 查 商品庫存
  // 加價購商品 or 主商品
  let product = addPrice ? addPrice : main
  // 商品某規格 or 商品沒規格
  let target = spec ? spec : product

  let type
  if (spec) type = 3
  else if (addPrice) type = 2
  else type = 1

  let query = {
    type,
    id: target.ID
  }
  if (addPrice) obj["pid"] = main.ID
*/
export const getAmountApi = (query) =>
  $fetch("/interface/store/GetProductQty", {
    method: "POST",
    query
  })
