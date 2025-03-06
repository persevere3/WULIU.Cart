// api
import { createNotEstablishedOrderApi } from "@/apis/order"

// json
import city_district_json from "@/json/city_district.json"

//
import { useRequest } from "@/composables/request"

export const usePurchaseInfoStore = defineStore("purchaseInfo", () => {
  let commonStore = useCommonStore()
  let productStore = useProductStore()
  let cartStore = useCartStore()
  let memberInfoStore = useMemberInfoStore()
  let orderStore = useOrderStore()

  const { return_formData } = useRequest()

  // state ==============================
  // 購買人資訊
  const info = ref({
    purchaser_email: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        mail: {
          message: "email格式不符"
        }
      },
      is_error: false,
      message: ""
    },
    purchaser_name: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        name: {
          message: "請輸入全中文或全英文"
        },
        nameLength: {
          message: "中文長度請介於2~5，英文長度請介於4~10"
        }
      },
      is_error: false,
      message: ""
    },
    purchaser_phone: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        cellphone: {
          message: "格式錯誤"
        }
      },
      is_error: false,
      message: ""
    },
    receiver_name: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        name: {
          message: "請輸入全中文或全英文"
        },
        nameLength: {
          message: "中文長度請介於2~5，英文長度請介於4~10"
        }
      },
      is_error: false,
      message: ""
    },
    receiver_number: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        cellphone: {
          message: "格式錯誤"
        }
      },
      is_error: false,
      message: ""
    },

    //
    address: {
      city_active: "",
      is_show_city: false,
      district_active: "",
      is_show_district: false,
      detail_address: "",
      rules: {
        required: {
          message: "請輸入收件地址"
        }
      },
      is_error: false,
      message: ""
    }
  })
  // 訂單備註
  const info_message = ref("")

  // 地址是否為常用地址
  const has_address = ref(false)
  // 是否儲存為常用地址
  const is_save_address = ref(false)

  // 便利商店 門市
  const storeid = ref("")
  const storename = ref("")
  const storeaddress = ref("")

  // 發票
  // "0" "1" 個人紙本 "2" "3" "4"
  const invoice_type = ref("0")
  // "個人發票" "公司發票"
  const personal_or_company = ref("")
  // invoice_type "3" 手機載具
  const phone_barCode = ref("")
  // invoice_type "4" 自然人載具
  const natural_barCode = ref("")
  // invoice_type "2" 公司
  const invoice_title = ref("")
  const invoice_uniNumber = ref("")

  // 配送狀態
  const transport_obj = ref({
    0: "",
    1: "一般宅配",
    2: "到店自取",
    UNIMARTDelivery: "7-11 取貨付款",
    UNIMARTC2CDelivery: "7-11 取貨付款",
    UNIMART: "7-11 取貨不付款",
    UNIMARTC2C: "7-11 取貨不付款",
    UNIMARTFREEZEDelivery: "7-11冷凍 取貨付款",
    UNIMARTFREEZE: "7-11冷凍 取貨不付款",

    FAMIDelivery: "全家 取貨付款",
    FAMIC2CDelivery: "全家 取貨付款",
    FAMI: "全家 取貨不付款",
    FAMIC2C: "全家 取貨不付款",

    HILIFEDelivery: "萊爾富 取貨付款",
    HILIFEC2CDelivery: "萊爾富 取貨付款",
    HILIFE: "萊爾富 取貨不付款",
    HILIFEC2C: "萊爾富 取貨不付款",

    OKMARTC2CDelivery: "OK超商 取貨付款",
    OKMARTC2C: "OK超商 取貨不付款"
  })
  const transport = ref("0")
  const is_show_transport_options = ref(false)

  const activeStore = ref(null)

  // 支付方式
  const pay_method = ref("0")

  //
  const city_district = city_district_json

  //
  const notEstablishedOrderInfo = ref({})

  // computed ==============================
  // `${city} ${district} ${detail}`
  // has_address 判斷
  const receiver_address = computed(() => {
    let address = `${info.value.address.city_active} ${info.value.address.district_active} ${info.value.address.detail_address}`
    if (memberInfoStore.memberInfo.address_obj) {
      has_address.value = false
      for (let key in memberInfoStore.memberInfo.address_obj) {
        let item = memberInfoStore.memberInfo.address_obj[key]
        if (item.address == address) {
          has_address.value = true
        }
      }
    }
    return address
  })
  // 配送狀態是否選擇門市
  const is_store = computed(() => {
    if (transport.value == 0) return undefined
    else if (transport.value === "1" || transport.value === "2") return false
    else return true
  })

  // methods ==============================
  // 選擇超商
  async function pickConvenienceStore() {
    let order_info = {
      info: {
        purchaser_email: info.value.purchaser_email.value,
        purchaser_name: info.value.purchaser_name.value,
        purchaser_phone: info.value.purchaser_phone.value,
        receiver_name: info.value.receiver_name.value,
        receiver_number: info.value.receiver_number.value
      },
      info_message: info_message.value,

      transport: transport.value,
      pay_method: pay_method.value,

      invoice_type: invoice_type.value,
      personal_or_company: personal_or_company.value,
      phone_barCode: phone_barCode.value,
      natural_barCode: natural_barCode.value,
      invoice_title: invoice_title.value,
      invoice_uniNumber: invoice_uniNumber.value,

      is_use_bonus: cartStore.is_use_bonus,
      use_bonus: cartStore.use_bonus,

      discountCode: cartStore.discountCode,
      successUsedDiscountCode: cartStore.successUsedDiscountCode
    }
    localStorage.setItem("order_info", JSON.stringify(order_info))

    let isTest = true
    let MerchantID
    if (process.env.NODE_ENV === "development" || isTest) {
      orderStore.ECPay_store_form_value = `<form id="ECPay_store_form" action="https://logistics-stage.ecpay.com.tw/Express/map" method="post">`
      MerchantID = transport.value.indexOf("C2C") > -1 ? "2000933" : "2000132"
    } else {
      orderStore.ECPay_store_form_value = `<form id="ECPay_store_form" action="https://logistics.ecpay.com.tw/Express/map" method="post">`
      MerchantID = commonStore.store.ECStore
    }
    let LogisticsSubType = transport.value.replace("Delivery", "")
    let IsCollection = transport.value.indexOf("Delivery") > -1 ? "Y" : "N"

    let obj = {
      MerchantID,
      MerchantTradeNo: "",
      LogisticsType: "CVS",
      LogisticsSubType,
      IsCollection,
      ServerReplyURL: `${location.origin}/interface/store/SpmarketAddress`,
      ExtraData: "",
      Device: ""
    }

    for (let key in obj) {
      orderStore.ECPay_store_form_value += `<input type="${
        key == "Device" ? "number" : "text"
      }" name="${key}" value="${obj[key]}">`
    }
    orderStore.ECPay_store_form_value += `</form>`

    await nextTick()
    let ECPay_store_form = document.querySelector("#ECPay_store_form")
    ECPay_store_form && ECPay_store_form.submit()
  }
  // 回填購買人資訊 + 設定 storeid storename storeaddress 的值
  function getConvenienceStore(id, name, address) {
    if (!id || !name || !address) return

    returnInfo()

    storeid.value = id
    storename.value = decodeURI(name)
    storeaddress.value = decodeURI(address)

    if (!productStore.isSingleProduct) {
      cartStore.step = 2
    }
  }
  // 選完超商，將localStorage存的資訊填回購買人資訊
  function returnInfo() {
    let order_info = JSON.parse(localStorage.getItem("order_info")) || {}

    info.value.purchaser_email.value = order_info.info.purchaser_email
    info.value.purchaser_name.value = order_info.info.purchaser_name
    info.value.purchaser_phone.value = order_info.info.purchaser_phone
    info.value.receiver_name.value = order_info.info.receiver_name
    info.value.receiver_number.value = order_info.info.receiver_number

    info_message.value = order_info.info_message

    transport.value = order_info.transport
    pay_method.value = order_info.pay_method

    invoice_type.value = order_info.invoice_type
    invoice_title.value = order_info.invoice_title
    invoice_uniNumber.value = order_info.invoice_uniNumber

    personal_or_company.value = order_info.personal_or_company
    natural_barCode.value = order_info.natural_barCode
    phone_barCode.value = order_info.phone_barCode

    cartStore.is_use_bonus = order_info.is_use_bonus
    cartStore.use_bonus = order_info.use_bonus

    cartStore.discountCode = order_info.discountCode
    cartStore.successUsedDiscountCode = order_info.successUsedDiscountCode
  }

  // 調整 use_bonus， 不能 > total_bonus，不能 > Total - Discount - DiscountCode
  async function filter_use_bonus(stepPage) {
    if (!commonStore.user_account) {
      cartStore.is_use_bonus = false
      cartStore.use_bonus = 0
      return
    }

    cartStore.use_bonus = useNumber(cartStore.use_bonus)

    if (cartStore.use_bonus > 0) {
      let use_bonus_max = Math.min(
        memberInfoStore.memberInfo.total_bonus * 1,
        cartStore.total.Total * 1 -
          cartStore.total.Discount * 1 -
          cartStore.total.DiscountCode * 1
      )
      if (cartStore.use_bonus > use_bonus_max)
        cartStore.use_bonus = use_bonus_max
    }

    await cartStore.getTotal(stepPage)
  }

  // 產生隨機id
  function generateUniqueId() {
    return (
      Math.random().toString(36).substr(2, 6) +
      "-" +
      Math.random().toString(36).substr(2, 6)
    )
  }

  // 創建一筆未成立訂單
  async function storeNotEstablishedOrderInfo() {
    if (process.server) return

    console.log(cartStore.cart.length)
    if (cartStore.cart.length < 1) return

    let id_key = ""
    if (commonStore.user_account) {
      id_key = `${commonStore.user_account}_id`
    } else {
      id_key = `notMember_id`
    }

    let id = localStorage.getItem(id_key)
    if (!id) {
      id = generateUniqueId().trim()
      localStorage.setItem(id_key, id)
    }

    notEstablishedOrderInfo.value.Member = commonStore.user_account ? 1 : 0
    notEstablishedOrderInfo.value.StoreID = commonStore.site.Name
    notEstablishedOrderInfo.value.TempFlino = id

    notEstablishedOrderInfo.value.CustomerName = info.value.receiver_name.value
    notEstablishedOrderInfo.value.Phone = info.value.receiver_number.value

    if (pay_method.value) {
      notEstablishedOrderInfo.value.PayWay =
        orderStore.payMethod_obj[pay_method.value]
    } else {
      notEstablishedOrderInfo.value.PayWay = ""
    }
    if (transport.value) {
      notEstablishedOrderInfo.value.SendWay =
        transport_obj.value[transport.value]
    } else {
      notEstablishedOrderInfo.value.SendWay = ""
    }

    let products = []
    cartStore.cart.forEach((item) => {
      if (!item.specArr) {
        products.push({
          ProductName: item.Name,
          ProducNum: item.ProducNum,
          Spec1: "",
          Spec2: "",
          ProductAmount: item.buyQty
        })
      } else {
        item.specArr.forEach((spec) => {
          if (spec.buyQty) {
            products.push({
              ProductName: item.Name,
              ProducNum: spec.ProductNum,
              Spec1: spec.Name,
              Spec2: spec.Name2,
              ProductAmount: spec.buyQty
            })
          }
        })
      }
    })
    notEstablishedOrderInfo.value.ProductItems = JSON.stringify(products)

    localStorage.setItem(
      "notEstablishedOrderInfo.value.test",
      JSON.stringify(notEstablishedOrderInfo.value)
    )

    let formData = return_formData(notEstablishedOrderInfo.value)
    try {
      createNotEstablishedOrderApi(formData)
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    info,

    has_address,
    is_save_address,

    storeid,
    storename,
    storeaddress,

    info_message,

    invoice_type,
    personal_or_company,
    phone_barCode,
    natural_barCode,
    invoice_title,
    invoice_uniNumber,

    transport_obj,
    transport,
    is_show_transport_options,

    activeStore,

    pay_method,

    city_district,

    notEstablishedOrderInfo,

    receiver_address,
    is_store,

    pickConvenienceStore,
    getConvenienceStore,
    returnInfo,

    filter_use_bonus,

    storeNotEstablishedOrderInfo
  }
})
