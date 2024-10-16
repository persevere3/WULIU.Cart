/* 訂單 */

/* 增 */
export const createOrderApi = (formData) =>
  $fetch("/LineMK/Line/OrderPayRequest", {
    method: "POST",
    body: formData
  })

/* 查(一般) */
export const getOrderApi = (formData) =>
  $fetch("/interface/web/GetOrderContactAjax", {
    method: "POST",
    body: formData
  })

/* 查(會員) */
export const getMemberOrderApi = (formData) =>
  $fetch("/interface/Webmember/GetMemberOrders", {
    method: "POST",
    body: formData
  })

/* 查便利商店運送狀態 */
export const searchMartDeliveryApi = (formData) =>
  $fetch("/interface/store/QueryLogisticsInfo", {
    method: "POST",
    body: formData
  })
