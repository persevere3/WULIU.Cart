/* 訂單 */

/* 增
  
*/
export const createOrderApi = (query) =>
  $fetch("/LineMK/Line/OrderPayRequest", {
    method: "POST",
    query
  })

/*
  查(一般)
  let obj = {
    Site: site.value.Site,
    Store: site.value.Store,

    phone: state.order_phone.trim(),
    email: state.order_mail.trim(),

    pagesize: state.order_page_size,
    pageindex: state.order_page_index,

    filter_number: state.filter_number,
    filter_pay: state.filter_pay,
    filter_delivery: state.filter_delivery
  }
  let formData = return_formData(obj)
*/
export const getOrderApi = (formData) =>
  formDataRequest.post("/interface/web/GetOrderContactAjax", formData)

/*
  查(會員)
  let obj = {
    site: site.value.Site,
    storeid: site.value.Name,
    storename: site.value.Store,

    phone: state.order_phone,
    email: state.order_mail,

    pageindex: state.order_page_index,
    pagesize: state.order_page_size,

    filter_number: state.filter_number,
    filter_pay: state.filter_pay,
    filter_delivery: state.filter_delivery,
  }
  let formData = return_formData(obj)
*/
export const getMemberOrderApi = (formData) =>
  formDataRequest.post("/interface/Webmember/GetMemberOrders", formData)

/*
  查便利商店運送狀態 
  let obj = {
    Site: site.value.Site,
    Store: site.value.Name,
    MerchantTradeNo: item.FilNo,
    LogisticsSubType: item.Mart.replace('Delivery', '')
  }
  let formData = return_formData(obj)
*/
export const searchMartDeliveryApi = (formData) =>
  formDataRequest.post("/interface/store/QueryLogisticsInfo", formData)
