/* 確認付款(已轉帳，post帳戶號碼) */
export const confirmPayApi = (formData) =>
  $fetch("/interface/web/ATMComfirmBack", {
    method: "POST",
    body: formData
  })

/* 重新付款 */
export const rePayApi = (formData) =>
  $fetch("/LineMK/Line/RePayConfirm", {
    method: "POST",
    body: formData
  })
