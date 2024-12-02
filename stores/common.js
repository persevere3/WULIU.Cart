import { storeLoginApi, initialWebApi, ajaxStoreApi } from "@/apis/common"

import bank_json from "@/json/bank"

import { useAppendScript } from "@/composables/appendScript"
import { useUrlPush } from "@/composables/urlPush"

export const useCommonStore = defineStore("common", () => {
  const config = useRuntimeConfig()
  const productStore = useProductStore()
  const cartStore = useCartStore()
  const purchaseInfoStore = usePurchaseInfoStore()
  const memberInfoStore = useMemberInfoStore()

  const bank = bank_json

  // state ==============================
  const webData = ref({})
  /* site.MemberFuction: 會員系統 */
  const site = ref({})
  const store = ref({})
  const all = ref({})
  const footer_community = ref({})
  const copyRight = ref({})
  const customerService = ref({})

  const user_account = ref("")

  const is_initial = ref(false)
  const is_getAll = ref(false)
  const is_logout = ref(null)

  // ----------
  const messageArr = ref([])

  const isConfirmToPay = ref(false)
  const isConfirmDiscountCodeUsed = ref(false)
  const isConfirmATM = ref(false)
  const isConfirmIsRegister = ref(false)
  const isConfirmRegister = ref(false)

  const isConfirmEditPass = ref(false)
  const isConfirmATM2 = ref(false)
  const isConfirmCheckPay = ref(false)

  // methods ==============================
  function storeLogin() {
    const site = JSON.parse(localStorage.getItem("site")) || {}

    let query = {
      site: site.Site,
      store: site.Name,
      Preview: site.Preview,
      WebPreview: site.WebPreview
    }

    try {
      return storeLoginApi(query)
    } catch (error) {
      throw new Error(error)
    }
  }
  function resHandler(res) {
    if (res.errormessage || (res.GetSite && res.GetSite.data.length == 0)) {
      try {
        storeLogin()
      } catch (error) {
        throw new Error(error)
      }

      return false
    } else return true
  }

  // ---------------
  function getInitialWebQuery() {
    // pagetype
    let pagetype = 1
    if (useRoute().name.indexOf("cart") > -1) pagetype = 0
    else if (useRoute().name === "/" || useRoute().name.indexOf("index") > -1)
      pagetype = 1
    else if (
      useRoute().name.indexOf("allProducts") > -1 ||
      useRoute().name.indexOf("category") > -1
    )
      pagetype = 3
    else if (useRoute().name.indexOf("contact") > -1) pagetype = 5
    else if (useRoute().name.indexOf("rich") > -1) {
      if (useRoute().query["cid"] == 0) pagetype = 3
      else if (useRoute().query["cid"] == 1 || useRoute().query["cid"] == 2)
        pagetype = 4
      else if (useRoute().query["cid"] == 3) pagetype = 2
    }

    return { pagetype }
  }

  function webHandler() {
    console.log(webData.value)

    site.value = webData.value.GetSite?.data[0] || {}

    // FeedbackFund => bonus_array ----------
    if (site.value.FeedbackFund) {
      cartStore.bonus_array = JSON.parse(site.value.FeedbackFund)
    }

    if (site.value.WebEnable == 0) useUrlPush("/error")

    is_initial.value = true

    allHandler()
    storeHandler(webData.value.GetStore?.data[0])

    copyRightHandler()
    customerServiceHandler()

    productStore.productsHandler(webData.value.StoreLogin)

    if (user_account.value) memberInfoStore.getMemberInfo()
  }

  async function ajaxWeb() {
    let { pagetype } = getInitialWebQuery()
    let query = {
      webpreview: site.value.webpreview || 1,
      id: useRoute().query.id || 0,
      pagetype
    }
    try {
      const res = JSON.parse(await initialWebApi(query))
      const isResSuccess = resHandler(res, ajaxWeb)
      if (!isResSuccess) return ajaxWeb()

      webData.value = res
    } catch (error) {
      console.log(error)
    }
  }

  // ---------------
  async function allHandler() {
    all.value = webData.value.WebLogin || {}

    // webcategory, websubcategory => navbar ------------
    let navbar = []
    all.value.webcategory.forEach((category) => {
      let link
      // category.Class 0: all category rich, 1: contact, 2: 外部連結, 3: 自訂義
      if (category.Class === "1") link = "/contact"
      else if (category.Class === "2") link = category.Text
      else if (category.Class === "3") link = `/rich?id=${category.ID}&cid=3`

      category.Link = link
      category.isDropDown = false
      navbar.push(category)
    })
    all.value.websubcategory.forEach((category) => {
      let link
      //category.Class 0: all, 1: category, 2: rich, 3: rich(footer)
      if (category.Class === "3") link = `/rich?id=${category.CategoryID}&cid=1`
      else if (category.Class === "2") link = `/rich?id=${category.ID}&cid=0`
      else if (category.Class === "1") link = `/category?id=${category.ID}`
      else link = `/allProducts?id=${category.ID}`

      category.Link = link

      let nav = navbar.find((nav) => nav.ID == category.Category)
      if (nav) {
        if (!nav.subNavbar) nav.subNavbar = []
        nav.subNavbar.push(category)
      }
    })
    all.value.Navbar = navbar

    // footer => about, client ------------
    let about = []
    let client = []
    all.value.footer.forEach((item) => {
      if (item.CID == 1) {
        item.Link = `/rich?id=${item.ID}&cid=1`
        about.push(item)
      } else if (item.CID == 2) {
        item.Link = `/rich?id=${item.ID}&cid=2`
        client.push(item)
      }
    })
    all.value.about = about
    all.value.client = client

    is_getAll.value = true
  }
  async function storeHandler(res) {
    store.value = res

    let cartStore = webData.value.GetStoreFromStore.data[0]
    delete cartStore.Logo

    store.value = { ...store.value, ...cartStore }

    if (process.env.NODE_ENV === "development") {
      store.value.Logo = config.public.apiUrl + store.value.Logo
    }

    footer_community.value = webData.value.GetStore.footer[0] || {}

    // title ------------
    !document.title && (document.title = store.value.Name)
    if (site.value.WebPreview == 2) document.title += " (預覽模式)"

    // GA ------------
    let GAText = store.value.GA
    if (GAText && GAText.indexOf("GTM-") > -1) {
      let GTMID = GAText.split("GTM-")[1].split("')")[0]

      let noscript = document.createElement("noscript")
      noscript.setAttribute(
        "src",
        `https://www.googletagmanager.com/ns.html?id=GTM-${GTMID}`
      )
      noscript.setAttribute("height", "0")
      noscript.setAttribute("width", "0")
      noscript.setAttribute("style", "display:none; visibility:hidden")

      document
        .querySelector("body")
        .insertBefore(noscript, document.querySelector("body div"))
    }
    useAppendScript(GAText, "head")

    // user_account ----------
    user_account.value = localStorage.getItem("user_account")

    // Line 登入
    let account = useRoute().query["account"]
    if (account) user_account.value = account

    // Line 綁定
    let result = useRoute().query["result"]
    if (result) {
      result = JSON.parse(decodeURI(result))
      if (!result.status) showMessage(result.msg, false)
      else user_account.value = result.account
    }

    // store.value.OrderPaymethod => store.value.paymethodSort ----------
    store.value.paymethodSort = {}
    if (store.value.OrderPaymethod) {
      store.value.OrderPaymethod = JSON.parse(store.value.OrderPaymethod)
      store.value.OrderPaymethod.forEach((item) => {
        store.value.paymethodSort[item.name] = parseInt(item.order)
      })
    }

    /* CVSSetting
      FAMI
      FAMIC2C
      FAMIC2CDelivery
      FAMIDelivery
      FAMIShipping

      HILIFE
      HILIFEC2C
      HILIFEC2CDelivery
      HILIFEDelivery
      HILIFEShipping
      
      OKMARTC2C
      OKMARTC2CDelivery
      OKMARTShipping
      
      UNIMART
      UNIMARTC2C
      UNIMARTC2CDelivery
      UNIMARTDelivery
      UNIMARTFREEZE
      UNIMARTFREEZEDelivery
      UNIMARTShipping
    */
    let CVSSetting = JSON.parse(store.value.CVSSetting)
    if (store.value.ECStatus == 0) {
      for (let key in CVSSetting) {
        if (key.indexOf("Shipping") > -1) {
          CVSSetting[key] = false
        }
      }
    }
    for (let key in CVSSetting) {
      if (key.indexOf("Shipping") > -1) continue
      let mart = key
        .replace("C2CC", "")
        .replace("C2C", "")
        .replace("FREEZE", "")
        .replace("Delivery", "")
      if (!CVSSetting[`${mart}Shipping`]) CVSSetting[key] = false
      store.value[key] = CVSSetting[key]
    }

    // 超商取貨付款 ----------
    let storeid = useRoute().query["CVSStoreID"]
    let storename = useRoute().query["CVSStoreName"]
    let storeaddress = useRoute().query["CVSAddress"]
    if (storeid && storename && storeaddress) {
      purchaseInfoStore.getConvenienceStore(storeid, storename, storeaddress)
    }
  }

  function copyRightHandler() {
    copyRight.value = webData.value.GetCopyRight.data[0] || {}
  }
  function customerServiceHandler() {
    customerService.value = webData.value.GetCustomerService.data[0] || {}
    useAppendScript(
      customerService.value.Text,
      customerService.value.Type == 1 ? "head" : "body"
    )
    // if(customerService.value.FBText ) useAppendScript(customerService.value.FBText, 'body')
  }

  // ---------------
  async function showMessage(messageStr, isSuccess) {
    // let message = messageArr.value.find(
    //   (message) => message.messageStr === messageStr
    // )
    // if (message) return

    let id = new Date().getTime()
    messageArr.value.push({
      id,
      messageStr,
      isSuccess,
      messageActive: false,
      messagefadeout: false
    })

    await promiseSetTimeout(() => {
      messageArr.value.find((item) => item.id === id).messageActive = true
    }, 100)

    await promiseSetTimeout(() => {
      messageArr.value.find((item) => item.id === id).messagefadeout = true
    }, 5000)

    await promiseSetTimeout(() => {
      let index = messageArr.value.findIndex((item) => item.id === id)
      index > -1 && messageArr.value.splice(index, 1)
    }, 500)
  }
  function promiseSetTimeout(func, ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        func()
        resolve()
      }, ms)
    })
  }

  // watch ==============================
  // site localStorage
  watch(
    () => site.Name,
    () => {
      localStorage.setItem("site", JSON.stringify(site.value))
    }
  )

  // user_account localStorage，purchaseInfoStore, memberInfoStore
  watch(user_account, (newV, oldV) => {
    if (newV) localStorage.setItem("user_account", newV)
    else localStorage.removeItem("user_account")

    if (!newV) {
      purchaseInfoStore.info.purchaser_email.value = ""
      purchaseInfoStore.info.purchaser_name.value = ""
      purchaseInfoStore.info.purchaser_phone.value = ""
      purchaseInfoStore.info.receiver_name.value = ""
      purchaseInfoStore.info.receiver_number.value = ""

      memberInfoStore.memberInfo.value = {}
    }
  })

  return {
    bank,

    webData,
    site,
    store,
    all,
    footer_community,
    copyRight,
    customerService,
    user_account,

    is_initial,
    is_getAll,
    is_logout,

    messageArr,

    isConfirmToPay,
    isConfirmDiscountCodeUsed,
    isConfirmATM,
    isConfirmIsRegister,
    isConfirmRegister,

    isConfirmEditPass,
    isConfirmCheckPay,
    isConfirmATM2,

    storeLogin,
    resHandler,

    getInitialWebQuery,
    ajaxWeb,
    webHandler,

    allHandler,
    storeHandler,

    copyRightHandler,
    customerServiceHandler,

    showMessage,
    promiseSetTimeout
  }
})
