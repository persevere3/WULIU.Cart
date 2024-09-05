import { formRequest, formDataRequest } from "@/utils/https"

/*
  確認付款(已轉帳，post帳戶號碼)
  let obj = {
    payflino: order_number.value,
    paytradeno: account_number.value,
  }
  let formData = return_formData(obj)
*/
export const confirmPayApi = (formData) =>
  $fetch("/interface/web/ATMComfirmBack", {
    method: "POST",
    body: formData
  })

/*
  重新付款
  let obj = {
    StoreId: site.value.Name,
    flino,
    url
  }
  let params = return_formData(obj)
*/
export const rePayApi = (query) =>
  $fetch("/LineMK/Line/RePayConfirm", {
    method: "POST",
    query
  })
