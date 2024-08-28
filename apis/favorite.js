/* 我的最愛商品 */

/* 查
  let obj = {
    storeid: commonStore.site.Name,
    phone: commonStore.user_account
  }
  let formData = return_formData(obj)
*/
export const getFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/FavoriteInfo", {
    method: "POST",
    body: formData
  })

/* 刪
  let obj = {
    storeid: commonStore.site.Name,
    phone: commonStore.user_account,
    "productid[]": id
  }
  let formData = return_formData(obj)
*/
export const deleteFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/DeleteFavorite", {
    method: "POST",
    body: formData
  })

/* 增
  let obj = {
    storeid: commonStore.site.Name,
    phone: commonStore.user_account,
    "productid[]": id
  }
  let formData = return_formData(obj)
*/
export const addFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/AddFavorite", {
    method: "POST",
    body: formData
  })
