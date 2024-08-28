/* 購物車 */

/* 使用折扣碼
  let query = {
    code: discountCode.value,
    Preview: commonStore.site.Preview
  }
*/
export const discountApi = (query) =>
  $fetch("/interface/store/CheckDiscountCode", {
    method: "POST",
    query
  })

/* 查 金額, 折扣, 運費, 總計
  let {
    id,
    qry,
    additionalid,
    additionalqry,
    specificationid,
    specificationqty
  } = createCartStrObj()

  if (!id && !specificationid) return

  isStepTwo = isStepTwo ? 1 : 0

  let shipping
  if (purchaseInfoStore.transport === "0") shipping = 3
  else if (purchaseInfoStore.transport === "1") shipping = 2
  else if (purchaseInfoStore.transport === "2") shipping = 3
  else shipping = 4

  let query = {
    id,
    qry,
    additionalid,
    additionalqry,
    specificationid,
    specificationqty,

    type: isStepTwo,
    code: successUsedDiscountCode.value,
    shipping,
    memberWallet: is_use_bonus.value ? use_bonus.value : 0,
    Preview: commonStore.site.Preview
  }
  if (shipping === 4) query["Mart"] = purchaseInfoStore.transport
*/
export const getTotalApi = (query) =>
  $fetch("/interface/store/GetProductTotal", {
    method: "POST",
    query
  })
