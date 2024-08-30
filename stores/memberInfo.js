import { useUrlPush } from "@/composables/urlPush"

import {
  getMemberInfoApi,
  logoutApi,
  updateMemberInfoApi,
  updateMemberPassApi,
  getBonusApi,
  unbindLine_testApi,
  deleteAccount_testApi
} from "@/apis/info"

export const useMemberInfoStore = defineStore("memberInfo", () => {
  // state ==============================
  const memberInfo = reactive({})

  const o_password = ref("")
  const r_password = ref("")
  const r_confirm_password = ref("")

  const total_bonus = ref(0)
  const bonus = ref([])

  const user_info = ref({})
  const user_info_nav_active = ref("info")

  const phone_barCode = ref("")
  const natural_barCode = ref("")

  const recommend_code = ref("")

  const delivery_address = ref([])
  const address_select_active = ref("")
  // methods ==============================
  // ???
  async function getMemberInfo() {
    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account
    }
    try {
      const res = await getMemberInfoApi(query)
      const isReqSuccess = resHandler(res, getMemberInfo)
      if (!isReqSuccess) return

      if (res.status) {
        const originMemberInfo = res.datas[0][0] || {}

        //
        originMemberInfo.ThreeLinkCode = originMemberInfo.ThreeLinkCode || ""
        originMemberInfo.invoice_title =
          originMemberInfo.ThreeLinkCode.split("|")[0] || ""
        originMemberInfo.invoice_uniNumber =
          originMemberInfo.ThreeLinkCode.split("|")[1] || ""

        login_handle_carts()

        originMemberInfo.name = originMemberInfo.Name
        originMemberInfo.mail = originMemberInfo.Email
        originMemberInfo.birthday = originMemberInfo.Birthday
          ? new Date(originMemberInfo.Birthday)
          : ""
        originMemberInfo.sex = originMemberInfo.Gender == 1 ? "male" : "female"
        originMemberInfo.phone = originMemberInfo.Phone
        originMemberInfo.phone2 = originMemberInfo.Phone2
        originMemberInfo.recommend_code = originMemberInfo.Promocode
        originMemberInfo.recommender = originMemberInfo.Recommender

        let result_arr = []
        originMemberInfo.address = decodeURI(originMemberInfo.Adress)
        let address_arr = originMemberInfo.Adress.split("_#_")
        address_arr.length = address_arr.length - 1
        for (let address of address_arr) {
          let item = address.split("_ _")
          result_arr.push({
            id: item[0],
            city: item[1],
            district: item[2],
            detail: item[3],
            rules: {
              required: {
                message: "請輸入完整地址"
              }
            },
            is_error: false,
            message: ""
          })
        }
        originMemberInfo.delivery_address = result_arr

        originMemberInfo.address_obj = createAddressObj(
          decodeURI(originMemberInfo.Adress)
        )

        originMemberInfo.phone_barCode = originMemberInfo.PhoneCode
        originMemberInfo.natural_barCode = originMemberInfo.NatureCode

        originMemberInfo.total_bonus = originMemberInfo.Wallet * 1

        // 取得訂單 參數
        order_phone.value = originMemberInfo.Phone
        order_mail.value = originMemberInfo.Email

        purchaseInfoStore.info.purchaser_email.value = originMemberInfo.Email
        purchaseInfoStore.info.purchaser_name.value = originMemberInfo.Name
        purchaseInfoStore.info.purchaser_number.value = originMemberInfo.Phone2

        purchaseInfoStore.phone_barCode = originMemberInfo.PhoneCode
        purchaseInfoStore.natural_barCode = originMemberInfo.NatureCode

        if (originMemberInfo.ThreeLinkCode) {
          let invoice_arr = originMemberInfo.ThreeLinkCode.split("|")
          if (!purchaseInfoStore.invoice_title)
            purchaseInfoStore.invoice_title = invoice_arr[0] || ""
          if (!purchaseInfoStore.invoice_uniNumber)
            purchaseInfoStore.invoice_uniNumber = invoice_arr[1] || ""
        }
      } else {
        commonStore.payModal_message = res.msg
        checkMessage()
        commonStore.is_payModal = true
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  function login_handle_carts() {
    let userCart =
      JSON.parse(
        localStorage.getItem(`${site.value.Name}@${user_account.value}@cart`)
      ) || []
    let localCart =
      JSON.parse(localStorage.getItem(`${site.value.Name}@cart`)) || []
    for (let localIndex in localCart) {
      let f = false
      for (let userIndex in userCart) {
        if (localCart[localIndex].ID === userCart[userIndex].ID) {
          userCart[userIndex] = localCart[localIndex]
          f = true
        }
      }
      if (!f) {
        userCart[userCart.length] = localCart[localIndex]
      }
    }
    cart.value = []
    userCart.forEach((item, index) => (cart.value[index] = item))
    localStorage.setItem(
      `${site.value.Name}@${user_account.value}@cart`,
      JSON.stringify(cart.value)
    )
  }
  function createAddressObj(address) {
    // memberInfo.Adress => memberInfo.address_obj
    // id: {id, address(`${city} ${district} ${detail}`)}
    let address_obj = {}
    let address_arr = address.split("_#_")
    address_arr.length -= 1
    for (let address of address_arr) {
      let item = address.split("_ _")
      address_obj[item[0]] = {
        id: item[0],
        address: `${item[1]} ${item[2]} ${item[3]}`
      }
    }
    return address_obj
  }

  async function edit_info() {
    if (
      !verify(
        memberInfo.name,
        memberInfo.mail,
        memberInfo.birthday,
        memberInfo.phone2
      )
    )
      return

    // 手機驗證
    // if(commonStore.store.NotificationSystem == 1 || commonStore.store.NotificationSystem == 2) {
    //   if(!verify(r_phone_verify_code.value)) return
    // }

    // 刪除重複地址
    let address_arr = memberInfo.delivery_address
    for (let i = address_arr.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (
          address_arr[j].city == address_arr[i].city &&
          address_arr[j].district == address_arr[i].district &&
          address_arr[j].detail == address_arr[i].detail
        ) {
          address_arr.splice(i, 1)
          break
        }
      }
    }

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account,

      name: memberInfo.name,
      email: memberInfo.mail,
      phone2: memberInfo.phone2,
      gender: memberInfo.sex == "male" ? 1 : 0,
      birthday: useFormatDate(memberInfo.birthday.value),
      recommender: memberInfo.recommender.value
    }

    // query 手機驗證
    // if(store.value.NotificationSystem == 1 || store.value.NotificationSystem == 2) {
    //   query["validate"] = r_phone_verify_code.value.value
    // }

    //
    let address_str = ""
    for (let item of address_arr) {
      address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
    }
    query["address"] = address_str
    query["savePhoneCode"] = memberInfo.phone_barCode || ""
    query["saveNatureCode"] = memberInfo.natural_barCode || ""
    query[
      "threeLinkCode"
    ] = `${memberInfo.invoice_title}|${memberInfo.invoice_uniNumber}`

    try {
      const res = await updateMemberInfoApi(query)
      const isReqSuccess = commonStore.resHandler(res, edit_info)
      if (!isReqSuccess) return

      getMemberInfo()
      commonStore.payModal_message = res.data.msg
      if (!res.status) checkMessage()
      commonStore.is_payModal = true
    } catch (error) {
      throw new Error(error)
    }
  }
  async function edit_pass() {
    if (!verify(o_password, r_password, r_confirm_password)) return

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account,
      oldpassword: o_password.value.value,
      newpassword: r_password.value.value
    }

    try {
      const res = await updateMemberPassApi(query)
      const isReqSuccess = commonStore.resHandler(res, edit_pass)
      if (!isReqSuccess) return

      commonStore.payModal_message = res.msg
      if (!res.status) checkMessage()
      commonStore.is_payModal = true
    } catch (error) {
      throw new Error(error)
    }
  }

  async function getBonus(type) {
    await getMemberInfo()

    if (!type) order_page_index.value = 1
    let query = {
      storeid: commonStore.site.Name,
      storename: commonStore.site.Store,
      phone: commonStore.user_account,

      recommander: memberInfo.recommend_code,
      pageindex: order_page_index.value,
      pagesize: order_page_size.value
    }

    try {
      const res = await getBonusApi(query)
      const isReqSuccess = commonStore.resHandler(res, getBonus)
      if (!isReqSuccess) return

      if (res.status) {
        let data = res.datas[0] || {}

        order_page_number.value = Math.ceil(data.Count / order_page_size.value)
        if (order_page_number.value == 0) {
          commonStore.payModal_message = "沒有您的購物金紀錄"
          commonStore.is_payModal = true
          bonus.value = null
          return
        } else {
          total_bonus.value = data.Total
          bonus.value = data.Bonuses
          bonus.value.forEach((item) => {
            if (item.Type.indexOf("使用點數") > -1) {
              item.FeedBack = -item.FeedBack
            }
          })
        }
      } else {
        commonStore.payModal_message = res.data.msg
        checkMessage()
        is_payModal.value = true
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  function add_address() {
    let id = new Date().getTime()
    if (memberInfo.delivery_address.length > 2) return
    memberInfo.delivery_address.push({
      id,
      city: "",
      district: "",
      detail: "",
      rules: {
        required: {
          message: "請輸入完整地址"
        }
      },
      is_error: false,
      message: ""
    })
  }
  function delete_address(id) {
    memberInfo.delivery_address = memberInfo.delivery_address.filter(
      (address) => address.id != id
    )
  }

  async function logoutHandler() {
    user_account.value = ""
    localStorage.removeItem("user_account")
    useUrlPush("/user.html")
  }
  async function ajaxLogout() {
    try {
      const res = await logoutApi()
      const isReqSuccess = resHandler(res, ajaxLogout)
      if (!isReqSuccess) return

      logoutHandler()
    } catch (error) {
      throw new Error(error)
    }
  }

  //
  function bindLine() {
    useUrlPush(
      `${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${site.value.Name}&site=${site.value.Site}&phone=${user_account.value}&method=LineRegister`
    )
  }

  //
  async function unbindLine_test() {
    let isConfim = confirm("確定解除Line綁定嗎？")
    if (!isConfim) return

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account
    }

    try {
      const res = await unbindLine_testApi(query)
      const isReqSuccess = resHandler(res, unbindLine_test)
      if (!isReqSuccess) return

      getMemberInfo()
    } catch (error) {
      throw new Error(error)
    }
  }

  async function deleteAccount_test() {
    let isConfim = confirm("確定刪除帳號嗎？")
    if (!isConfim) return

    let query = {
      storeid: site.value.Name,
      phone: user_account.value
    }

    try {
      const res = await deleteAccount_testApi(query)
      const isReqSuccess = resHandler(res, deleteAccount_test)
      if (!isReqSuccess) return

      logoutHandler()
    } catch (error) {
      throw new Error(error)
    }
  }

  watch(
    memberInfo,
    (newV) => {
      if (!newV.Phone && !newV.Email) {
        commonStore.user_account = ""
      }
      total_bonus.value = newV.Wallet * 1
    },
    { deep: true }
  )

  return {
    memberInfo,

    getMemberInfo,

    add_address,
    delete_address,
    ajaxLogout,
    logoutHandler,

    bindLine,
    unbindLine_test,
    deleteAccount_test
  }
})
