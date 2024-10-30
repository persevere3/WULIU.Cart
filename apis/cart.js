/* 購物車 */

/* 使用折扣碼 */
export const discountApi = (query) =>
  $fetch("/interface/store/CheckDiscountCode", {
    method: "POST",
    query
  })

/* 查 金額, 折扣, 運費, 總計 */
export const getTotalApi = (formData) =>
  $fetch("/interface/store/GetProductTotal", {
    method: "POST",
    body: formData
  })
