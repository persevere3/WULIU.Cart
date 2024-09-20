/* 我的最愛商品 */

/* 查 */
export const getFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/FavoriteInfo", {
    method: "POST",
    body: formData
  })

/* 刪 */
export const deleteFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/DeleteFavorite", {
    method: "POST",
    body: formData
  })

/* 增 */
export const addFavoriteApi = (formData) =>
  $fetch("/interface/WebMember/AddFavorite", {
    method: "POST",
    body: formData
  })
