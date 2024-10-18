// api
import {
  createOrderApi,
  getOrderApi,
  getMemberOrderApi,
  searchMartDeliveryApi
} from "@/apis/order"

import { rePayApi } from "@/apis/pay"

import { registerApi } from "@/apis/user"

import { useVerify } from "@/composables/verify"
import { useRequest } from "@/composables/request"
import { useUrlPush } from "@/composables/urlPush"

export const useOrderStore = defineStore("order", () => {
  let commonStore = useCommonStore()
  let cartStore = useCartStore()
  let purchaseInfoStore = usePurchaseInfoStore()
  let userStore = useUserStore()
  let memberInfoStore = useMemberInfoStore()

  const { verify } = useVerify()
  const { return_formData } = useRequest()

  // state ==============================
  //
  const is_click_finish_order = ref(false) // true => 驗證 運送方式 支付方式 地址
  const isOrderIng = ref(false)

  const payResult = ref({})
  const ECPay_form_value = ref("")
  const ECPay_store_form_value = ref("")

  //
  const search_phone = ref("0910456456")
  const search_mail = ref("test@gmail.com")
  const filter_number = ref("")
  const filter_pay = ref("0")
  const filter_delivery = ref("0")

  const order = ref({})
  // 展開某一筆訂單的產品列表
  const active_order_products = ref("")
  const activeOrder = ref(null)

  const payStatus_arr = ref([
    "",
    "付款成功",
    "尚未付款",
    "已退款",
    "待對帳",
    "尚未付款"
  ])
  const delivery_arr = ref([
    "",
    "已出貨",
    "準備中",
    "已退貨",
    "已取消",
    "已自取",
    "已送達",
    "已取貨"
  ])

  const payMethod_obj = ref({
    CreditCard: "信用卡",
    ATM: "ATM",
    PayCode: "超商代碼",
    PayBarCode: "超商條碼",
    PayOnDelivery: "宅配取貨付款",
    LinePay: "LinePay",
    MartPayOnDelivery: "超商取貨付款",
    MartOnDelivery: "超商取貨不付款"
  })

  const mart_obj = ref({
    UNIMART: "7-11",
    UNIMARTFREEZE: "7-11 冷凍",
    FAMI: "全家",
    HILIFE: "萊爾富",
    OKMART: "OK超商"
  })

  const order_pagination = reactive({
    perpageItemNum: 10,
    totalPageNum: 0,
    activePage: 1,
    is_show_options: false,
    options_arr: [10, 20, 30, 40, 50]
  })

  // 確認付款參數
  const order_number = ref("")
  const account_number = ref("")

  // 前往付款
  const noOrder = ref(false)

  // methods ==============================
  async function checkOrder() {
    if (commonStore.site.Preview == 2) {
      commonStore.showMessage("預覽模式不開放完成訂單", false)
      return
    }
    if (isOrderIng.value) return

    is_click_finish_order.value = true

    // 資訊驗證
    let verify_arr = [
      purchaseInfoStore.info.purchaser_email,
      purchaseInfoStore.info.purchaser_name,
      purchaseInfoStore.info.purchaser_phone,
      purchaseInfoStore.info.receiver_name,
      purchaseInfoStore.info.receiver_number
    ]
    // 地址驗證
    if (purchaseInfoStore.transport == 1)
      verify_arr.push(purchaseInfoStore.info.address)
    let v = verify(...verify_arr)

    if (v) {
      if (
        // 運送驗證
        purchaseInfoStore.transport !== "0" &&
        // 支付驗證
        purchaseInfoStore.pay_method !== "0" &&
        // 發票驗證
        (commonStore.store.Receipt === "0" ||
          purchaseInfoStore.invoice_type === "1" ||
          (purchaseInfoStore.invoice_type === "2" &&
            purchaseInfoStore.invoice_title !== "" &&
            purchaseInfoStore.invoice_uniNumber !== "") ||
          (purchaseInfoStore.invoice_type === "3" &&
            purchaseInfoStore.phone_barCode !== "") ||
          (purchaseInfoStore.invoice_type === "4" &&
            purchaseInfoStore.natural_barCode !== "")) &&
        // 門市驗證
        (purchaseInfoStore.is_store ? purchaseInfoStore.storeid !== "" : true)
      ) {
        await purchaseInfoStore.filter_use_bonus(1)
        createOrder()
      }
    }
  }
  async function cancelDiscountCodeCreateOrder() {
    cartStore.unDiscount()
    await cartStore.getTotal(1)
    commonStore.isConfirmDiscountCodeUsed = false
    createOrder()
  }
  async function createOrder() {
    isOrderIng.value = true

    let cartStrObj = cartStore.createCartStrObj()

    let query = {
      // 商店
      Site: commonStore.site.Site,
      StoreName: commonStore.site.Name,
      productName: commonStore.store.Name,
      LogoUrl: location.origin + commonStore.store.PayLogo,
      Preview: commonStore.site.Preview,

      // 商品
      ProductIdList: cartStrObj.id,
      PriceList: cartStrObj.price,
      AmountList: cartStrObj.qry,
      ExtraProductIdList: cartStrObj.additionalid,
      ExtraPriceList: cartStrObj.additionalprice,
      ExtraAmountList: cartStrObj.additionalqry,
      SizeIdList: cartStrObj.specificationid,
      SizeAmountList: cartStrObj.specificationqty,
      ItemName: cartStrObj.ItemName,

      // 折扣碼
      DiscountCode: cartStore.successUsedDiscountCode,

      // 金額
      Discount: cartStore.total.Discount * 1,
      DiscountPrice: cartStore.total.DiscountCode * 1,
      Shipping: cartStore.total.Shipping * 1,
      Total: cartStore.total.Sum * 1,

      // 購買人
      Email: purchaseInfoStore.info.purchaser_email.value,
      Name: purchaseInfoStore.info.purchaser_name.value,
      Phone: commonStore.user_account,
      Phone2: purchaseInfoStore.info.purchaser_phone.value,
      Receiver: purchaseInfoStore.info.receiver_name.value,
      ReceiverPhone: purchaseInfoStore.info.receiver_number.value,
      Message: purchaseInfoStore.info_message,

      // 購物金
      MemberWallet: cartStore.use_bonus,
      MemberBonus: cartStore.member_bonus
    }

    // 運送方式 支付方式
    if (
      purchaseInfoStore.transport === "1" ||
      purchaseInfoStore.transport === "2"
    ) {
      query["SendWay"] = purchaseInfoStore.transport
      query["PayMethod"] = purchaseInfoStore.pay_method
      query["PayType"] = commonStore.store[purchaseInfoStore.pay_method]
    } else {
      query["SendWay"] = 3
      query["Mart"] = purchaseInfoStore.transport

      if (purchaseInfoStore.transport.indexOf("Delivery") > -1) {
        query["PayMethod"] = purchaseInfoStore.transport
        query["PayType"] = 1
      } else {
        query["PayMethod"] = purchaseInfoStore.pay_method
        query["PayType"] = commonStore.store[purchaseInfoStore.pay_method]
      }

      // 0 代收 1 不代收
      query["IsCollection"] =
        purchaseInfoStore.transport.indexOf("Delivery") > -1 ? 0 : 1
    }

    // 地址
    if (purchaseInfoStore.is_store)
      query["Address"] = encodeURI(
        `${purchaseInfoStore.storeid} - ${purchaseInfoStore.storename} - ${purchaseInfoStore.storeaddress}`
      )
    else query["Address"] = encodeURI(purchaseInfoStore.receiver_address)
    if (
      memberInfoStore.memberInfo.address_obj &&
      Object.keys(memberInfoStore.memberInfo.address_obj).length < 3 &&
      !purchaseInfoStore.has_address &&
      purchaseInfoStore.is_save_address
    ) {
      let id = new Date().getTime()
      query["saveAddressStr"] = encodeURI(
        `${id}_ _${purchaseInfoStore.receiver_address.replace(/ /g, "_ _")}`
      )
    } else query["saveAddressStr"] = ""

    // 郵遞區號
    if (
      memberInfoStore.memberInfo.city_active &&
      memberInfoStore.memberInfo.district_active
    ) {
      query["ZipCode"] =
        purchaseInfoStore.city_district[memberInfoStore.memberInfo.city_active][
          memberInfoStore.memberInfo.district_active
        ]
    } else {
      query["ZipCode"] = ""
    }

    // 超商取貨付款
    if (purchaseInfoStore.is_store) query["StoreID"] = purchaseInfoStore.storeid

    // 發票
    query["Type"] = purchaseInfoStore.invoice_type * 1
    query["Title"] = purchaseInfoStore.invoice_title * 1
    if (purchaseInfoStore.invoice_type === "3") {
      query["UniNumber"] = purchaseInfoStore.phone_barCode
      query["savePhoneCode"] = purchaseInfoStore.phone_barCode
      query["saveNatureCode"] = ""
    } else if (purchaseInfoStore.invoice_type === "4") {
      query["UniNumber"] = purchaseInfoStore.natural_barCode
      query["savePhoneCode"] = ""
      query["saveNatureCode"] = purchaseInfoStore.natural_barCode
    } else query["UniNumber"] = purchaseInfoStore.invoice_uniNumber

    let FreeItem = JSON.parse(JSON.stringify(cartStore.total.FreeItem))
    FreeItem.forEach((item) => {
      delete item.Name
      delete item.productDiscountText
    })

    query["FreeItem"] = JSON.stringify(FreeItem)
    query["TradeDataCheckInfo"] = cartStore.total.tradeDataCheckInfo

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await createOrderApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return createOrder()

      if (res.success) {
        payResult.value = res
        // 沒有開啟會員功能
        if (!parseInt(commonStore.site.MemberFuction))
          commonStore.isConfirmToPay = true
        else {
          // 沒有登入
          if (!commonStore.user_account) {
            let hasAcount = await hasAccount()
            console.log(hasAcount)
            if (hasAcount) commonStore.isConfirmToPay = true
            else commonStore.isConfirmIsRegister = true
          }
          // 登入
          else {
            commonStore.isConfirmToPay = true
            memberInfoStore.getMemberInfo()
          }
        }

        cartStore.clearCart()

        isOrderIng.value = false
      } else {
        if (res.message.indexOf("已使用過折扣碼") > -1) {
          isOrderIng.value = false
          commonStore.isConfirmDiscountCodeUsed = true
          return
        }

        if (res.message.indexOf("數量不足") > -1) {
          cartStore.clearCart()
        }
        if (res.message.indexOf("購物金不足") > -1) {
          await memberInfoStore.getMemberInfo()
          cartStore.use_bonus = 0
          cartStore.getTotal(1)
        }
        isOrderIng.value = false
        commonStore.showMessage(res.message, false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function hasAccount() {
    let query = {
      storeid: commonStore.site.Name,
      type: commonStore.store.NotificationSystem,
      phone: purchaseInfoStore.info.purchaser_phone.value,
      email: purchaseInfoStore.info.purchaser_email.value,
      name: "",
      validate: "",
      validate2: "",
      password: "",
      birthday: "",
      gender: 0,
      recommender: ""
    }

    try {
      const res = JSON.parse(await registerApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return hasAccount()

      return res.msg.indexOf("已註冊") > -1
    } catch (error) {
      throw new Error(error)
    }
  }
  async function toPay() {
    commonStore.isConfirmToPay = false

    // LinePay
    if (purchaseInfoStore.pay_method == "LinePay") {
      useUrlPush(payResult.value.payUrl)
    }
    // company account
    else if (
      purchaseInfoStore.pay_method == "ATM" &&
      commonStore.store.ATM == 1
    ) {
      commonStore.isConfirmATM = true
    } else if (
      purchaseInfoStore.pay_method == "PayOnDelivery" ||
      purchaseInfoStore.pay_method == "MartPayOnDelivery"
    ) {
    }
    // ecpay
    else {
      // target="_blank"
      let isTest = true
      if (process.env.NODE_ENV === "development" || isTest) {
        ECPay_form_value.value = `<form id="ECPay_form" action="https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
      } else {
        ECPay_form_value.value = `<form id="ECPay_form" action="https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5" method="post">`
      }

      for (let item in payResult.value) {
        if (item === "success" || item === "message" || item === "membered")
          continue
        // EncryptType, TotalAmount, ExpireDate: number，other: string
        ECPay_form_value.value += `<input type="${
          item == "EncryptType" || item == "TotalAmount" || item == "ExpireDate"
            ? "number"
            : "text"
        }" name="${item}" value="${payResult.value[item]}">`
      }

      //
      // ECPay_form.value += `
      //     <div class="message"> 前往付款頁面 </div>
      //     <div class="button_row">
      //       <div class="button" onclick="document.querySelector('.ECPay_form_container').style.display = 'none'" > 取消 </div>
      //       <div class="button" onclick="document.querySelector('#ECPay_form').submit(); document.querySelector('.ECPay_form_container').style.display = 'none'" > 確認 </div>
      //     </div>
      //   </form>
      // `

      ECPay_form_value.value += `</form>`

      await nextTick()
      let ECPay_form_dom = document.querySelector("#ECPay_form")
      if (ECPay_form_dom) ECPay_form_dom.submit()
    }
  }

  //
  async function getOrder(type, is_filter) {
    console.log("getOrder")
    if (!search_phone.value) {
      commonStore.showMessage("請填寫購買人連絡電話", false)
      order.value = {}
      return
    } else if (!search_phone.value) {
      commonStore.showMessage("請填寫購買人電子信箱", false)
      order.value = {}
      return
    }

    if (!type) order_pagination.activePage = 1
    if (!is_filter) {
      filter_number.value = ""
      filter_pay.value = "0"
      filter_delivery.value = "0"
    }
    let query = {
      Site: commonStore.site.Site,
      Store: commonStore.site.Store,

      phone: search_phone.value.trim(),
      email: search_mail.value.trim(),

      pagesize: order_pagination.perpageItemNum,
      pageindex: order_pagination.activePage,

      filter_number: filter_number.value,
      filter_pay: filter_pay.value,
      filter_delivery: filter_delivery.value
    }

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await getOrderApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return getOrder()

      let orders = res.Orders
      let totalPage = Math.ceil(res.Count / order_pagination.perpageItemNum)
      if (totalPage == 0) {
        commonStore.showMessage("沒有您查詢的訂單資料", false)

        filter_number.value = ""
        filter_pay.value = "0"
        filter_delivery.value = "0"
        noOrder.value = true
        return
      } else {
        order.value = orders
        order_pagination.totalPageNum = totalPage
        noOrder.value = false
      }

      document.querySelector(".ECPay_form_container").style.display = "block"

      await nextTick()

      let uls = document.querySelectorAll(".td.products ul")
      uls.forEach(function (item, index) {
        let lis = item.querySelectorAll("li")
        if (lis.length > 4) {
          order.value[index]["expandable"] = true
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }
  function getMemberOrder(type, is_filter) {
    console.log("getMemberOrder")
    return new Promise(async (resolve) => {
      if (!type) order_pagination.activePage = 1
      if (!is_filter) {
        filter_number.value = ""
        filter_pay.value = "0"
        filter_delivery.value = "0"
      }
      let query = {
        site: commonStore.site.Site,
        storeid: commonStore.site.Name,
        storename: commonStore.site.Store,

        phone: search_phone.value,
        email: search_mail.value,

        pageindex: order_pagination.activePage,
        pagesize: order_pagination.perpageItemNum,

        filter_number: filter_number.value,
        filter_pay: filter_pay.value,
        filter_delivery: filter_delivery.value
      }

      let formData = return_formData(query)

      try {
        const res = JSON.parse(await getMemberOrderApi(formData))
        const isReqSuccess = commonStore.resHandler(res)
        if (!isReqSuccess) return getMemberOrder()

        if (res.status) {
          let data = res.datas[0] || {}

          order_pagination.totalPageNum = Math.ceil(
            data.Count / order_pagination.perpageItemNum
          )
          if (order_pagination.totalPageNum == 0) {
            commonStore.showMessage("沒有您查詢的訂單資料", false)
            order.value = {}
            return
          }

          order.value = data.Orders

          await nextTick()
          let uls = document.querySelectorAll(".td.products ul")
          uls.forEach(function (item, index) {
            let lis = item.querySelectorAll("li")
            if (lis.length > 4) {
              // 產品列表可展開
              order.value[index].expandable = true
            }
          })
        } else {
          commonStore.showMessage(res.msg, false)
          userStore.check_logout(res.msg)
        }

        resolve()
      } catch (error) {
        throw new Error(error)
      }
    })
  }

  async function rePay(flino, url) {
    let query = {
      StoreId: commonStore.site.Name,
      flino,
      url
    }

    try {
      const res = JSON.parse(await rePayApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return rePay(flino, url)

      if ("status" in res) {
        commonStore.showMessage(res.msg, true)
        if (commonStore.user_account) getMemberOrder()
        else getOrder()
      } else {
        payResult.value = res
        toPay()
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async function searchMartDelivery(item) {
    let MerchantTradeNo = item.FilNo
    let LogisticsSubType = item.Mart.replace("Delivery", "")

    let query = {
      Site: commonStore.site.Site,
      Store: commonStore.site.Name,
      MerchantTradeNo,
      LogisticsSubType
    }

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await searchMartDeliveryApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return searchMartDelivery(item)

      let martName = decodeURI(item.Address).split(" - ")[1] || ""
      let deliveryMsg = res.split("|")[0] || ""
      let deliveryNumber = res.split("|")[1] || ""
      if (deliveryMsg.indexOf("已配達") > -1) deliveryMsg += ` - ${martName}`
      item.deliveryMsg = deliveryMsg
      if (deliveryNumber) item.deliveryNumber = deliveryNumber
      activeOrder.value = item
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    is_click_finish_order,
    isOrderIng,

    payResult,
    ECPay_form_value,
    ECPay_store_form_value,

    search_phone,
    search_mail,
    filter_number,
    filter_pay,
    filter_delivery,

    order,
    active_order_products,
    activeOrder,

    payStatus_arr,
    delivery_arr,

    payMethod_obj,

    mart_obj,

    order_pagination,

    order_number,
    account_number,

    noOrder,

    checkOrder,
    cancelDiscountCodeCreateOrder,
    createOrder,
    hasAccount,
    toPay,

    getOrder,
    getMemberOrder,
    rePay,
    searchMartDelivery
  }
})
