import { useVerify } from "@/composables/verify"
import { useRequest } from "@/composables/request"
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
  const commonStore = useCommonStore()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()
  const userStore = useUserStore()
  const purchaseInfoStore = usePurchaseInfoStore()

  const { verify } = useVerify()
  const { return_formData } = useRequest()

  // state ==============================
  const member_info_nav_active = ref("info")

  // info ---------------
  const memberInfo = ref({})

  const e_form = reactive({
    // 姓名 信箱 手機 -----
    name: {
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
      message: "",
      readonly: false,
      placeholder: "* 請輸入姓名"
    },
    // :readonly="!!memberInfo.mail"
    mail: {
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
      message: "",
      readonly: false,
      placeholder: "* 請輸入電子信箱"
    },
    // :readonly="!!memberInfo.phone2"
    phone: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        cellphone: {
          message: "手機格式錯誤"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入手機(帳號)"
    },

    // 驗證 -----
    mail_verify_code: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        length: {
          min: 6,
          max: 6,
          message: "驗證碼為6位"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入電子信箱驗證碼"
    },
    phone_verify_code: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        length: {
          min: 6,
          max: 6,
          message: "驗證碼為6位"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入手機驗證碼"
    },
    second: 0,

    // 性別 生日 -----
    sex: "male",
    birthday: {
      value: "",
      placeholder: "* 請輸入生日",
      type: "date",
      originValue: ""
    },

    // 推薦人 推薦代碼 -----
    recommender: {
      value: "",
      readonly: true
    },
    recommend_code: {
      value: "",
      readonly: true,
      type: "copy"
    },

    // 發票 -----
    phone_barCode: {
      value: "",
      placeholder: "請輸入手機條碼載具"
    },
    natural_barCode: {
      value: "",
      placeholder: "請輸入自然人憑證載具"
    },
    invoice_title: {
      value: "",
      placeholder: "請輸入公司抬頭"
    },
    invoice_uniNumber: {
      value: "",
      placeholder: "請輸入統一編號"
    },

    // 密碼 -----
    o_password: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        length: {
          min: 8,
          message: "不得少於8位"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入原密碼",
      type: "password",
      visible: false
    },
    password: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        length: {
          min: 8,
          message: "不得少於8位"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入密碼",
      type: "password",
      visible: false
    },
    confirm_password: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        },
        confirm: {
          password: null,
          message: "密碼不正確"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請再次輸入密碼",
      type: "password",
      visible: false
    },

    // 地址 -----
    delivery_address: {},
    address_select_active: ""
  })
  e_form.confirm_password.rules.confirm.password = e_form.password

  // bonus ---------------
  const bonus = ref([])

  const bonus_pagination = reactive({
    perpageItemNum: 10,
    totalPageNum: 0,
    activePage: 1,
    is_show_options: false,
    options_arr: [10, 20, 30, 40, 50]
  })

  // methods ==============================
  // info ---------------
  async function getMemberInfo() {
    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account
    }
    let formData = return_formData(query)

    try {
      const res = JSON.parse(await getMemberInfoApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return getMemberInfo()

      if (res.status) {
        const originInfo = res.datas[0][0] || {}

        // Registermethod ConnectLine 沒有特別處理

        // 姓名 信箱 電話 ---------------
        originInfo.name = originInfo.Name
        originInfo.mail = originInfo.Email
        originInfo.phone = originInfo.Phone
        originInfo.phone2 = originInfo.Phone2

        // 自動填入 編輯資訊
        e_form.name.value = originInfo.name
        e_form.mail.value = originInfo.mail
        e_form.phone.value = originInfo.phone2

        e_form.mail.readonly = !!originInfo.mail
        e_form.phone.readonly = !!originInfo.phone2

        // 自動填入 訂單查詢
        orderStore.search_mail = originInfo.mail
        orderStore.search_phone = originInfo.phone2

        // 自動填入 購買人資訊
        purchaseInfoStore.info.purchaser_name.value = originInfo.name
        purchaseInfoStore.info.purchaser_email.value = originInfo.mail
        purchaseInfoStore.info.purchaser_phone.value = originInfo.phone2

        // 性別 生日 ---------------
        originInfo.sex = originInfo.Gender == 1 ? "male" : "female"

        originInfo.birthday = originInfo.Birthday

        // 自動填入 編輯資訊
        e_form.sex = originInfo.sex
        e_form.birthday.value = originInfo.Birthday
        e_form.birthday.originValue = originInfo.Birthday

        // 推薦人代碼 推薦代碼 ---------------
        originInfo.recommender = originInfo.Recommender
        originInfo.recommend_code = originInfo.Promocode

        // 自動填入 編輯資訊
        e_form.recommender.value = originInfo.recommender
        e_form.recommend_code.value = originInfo.recommend_code

        // 手機條碼 自然人憑證 ---------------
        originInfo.phone_barCode = originInfo.PhoneCode
        originInfo.natural_barCode = originInfo.NatureCode

        // 自動填入 編輯資訊
        e_form.phone_barCode.value = originInfo.phone_barCode
        e_form.natural_barCode.value = originInfo.natural_barCode

        // 自動填入 購買人資訊
        purchaseInfoStore.phone_barCode = originInfo.phone_barCode
        purchaseInfoStore.natural_barCode = originInfo.natural_barCode

        // 抬頭 統編 ---------------
        originInfo.ThreeLinkCode = originInfo.ThreeLinkCode || ""
        let invoice_arr = originInfo.ThreeLinkCode.split("|")
        let title = invoice_arr[0] || ""
        let uniNumber = invoice_arr[1] || ""

        originInfo.invoice_title = title
        originInfo.invoice_uniNumber = uniNumber

        // 自動填入 編輯資訊
        e_form.invoice_title.value = title
        e_form.invoice_uniNumber.value = uniNumber

        // 自動填入 購買人資訊
        if (originInfo.ThreeLinkCode) {
          if (!purchaseInfoStore.invoice_title)
            purchaseInfoStore.invoice_title = title
          if (!purchaseInfoStore.invoice_uniNumber)
            purchaseInfoStore.invoice_uniNumber = uniNumber
        }

        // 地址 ---------------
        let result_arr = []
        originInfo.address = decodeURI(originInfo.Adress)
        let address_arr = originInfo.Adress.split("_#_")
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
        originInfo.delivery_address = result_arr

        originInfo.address_obj = createAddressObj(decodeURI(originInfo.Adress))

        // 自動填入 編輯資訊
        e_form.delivery_address = originInfo.delivery_address

        // 回饋金 ---------------
        originInfo.total_bonus = originInfo.Wallet * 1

        //
        memberInfo.value = originInfo
      } else {
        commonStore.showMessage(res.msg, false)
        userStore.check_logout(res.msg)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  function login_handle_cart() {
    let localKey = `${commonStore.site.Name}@cart`
    let localCart
    if (localStorage.getItem(localKey)) {
      localCart = JSON.parse(localStorage.getItem(localKey))
    } else {
      localCart = []
    }

    cartStore.cart = localCart
    cartStore.setCart()
  }

  async function edit_info() {
    if (!verify(e_form.name, e_form.mail, e_form.birthday, e_form.phone)) return

    // 手機驗證
    // if(commonStore.store.NotificationSystem == 1 || commonStore.store.NotificationSystem == 2) {
    //   if(!verify(e_form.phone_verify_code)) return
    // }

    // 刪除 空地址 重複地址
    e_form.delivery_address = e_form.delivery_address.filter(
      (a) => a.city && a.district && a.detail
    )
    let address_arr = e_form.delivery_address
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

      name: e_form.name.value,
      email: e_form.mail.value,
      phone2: e_form.phone.value,
      gender: e_form.sex == "male" ? 1 : 0,
      birthday: useFormatDate(new Date(e_form.birthday.value)),
      recommender: e_form.recommender.value
    }

    // query 手機驗證
    // if(commonStore.store.NotificationSystem == 1 || commonStore.store.NotificationSystem == 2) {
    //   query["validate"] = e_form.phone_verify_code.value
    // }

    //
    let address_str = ""
    for (let item of address_arr) {
      address_str += `${item.id}_ _${item.city}_ _${item.district}_ _${item.detail}_#_`
    }
    query["address"] = address_str
    query["savePhoneCode"] = e_form.phone_barCode.value || ""
    query["saveNatureCode"] = e_form.natural_barCode.value || ""
    query[
      "threeLinkCode"
    ] = `${e_form.invoice_title.value}|${e_form.invoice_uniNumber.value}`

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await updateMemberInfoApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return edit_info()

      if (res.status) {
        getMemberInfo()
        commonStore.showMessage("修改成功", true)
      } else {
        commonStore.showMessage("修改失敗，請再試一次", false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  async function edit_pass() {
    if (!verify(e_form.o_password, e_form.password, e_form.confirm_password))
      return

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account,
      oldpassword: e_form.o_password.value,
      newpassword: e_form.password.value
    }

    try {
      const res = JSON.parse(await updateMemberPassApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return edit_pass()

      if (res.status) {
        commonStore.showMessage(res.msg, true)
        commonStore.isConfirmEditPass = false
      } else {
        commonStore.showMessage(res.msg, false)
        userStore.check_logout(res.msg)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  function createAddressObj(address) {
    // memberInfo.value.Adress => memberInfo.value.address_obj
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

  function add_address() {
    let id = new Date().getTime()
    if (e_form.delivery_address.length > 2) return
    e_form.delivery_address.push({
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
    e_form.delivery_address = e_form.delivery_address.filter(
      (address) => address.id != id
    )
  }

  // bonus ---------------
  async function getBonus(type) {
    if (!type) bonus_pagination.activePage = 1

    let query = {
      storeid: commonStore.site.Name,
      storename: commonStore.site.Store,
      phone: commonStore.user_account,

      recommander: memberInfo.value.recommend_code,

      pageindex: bonus_pagination.activePage,
      pagesize: bonus_pagination.perpageItemNum
    }
    let formData = return_formData(query)

    try {
      const res = JSON.parse(await getBonusApi(formData))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return getBonus()

      if (res.status) {
        let data = res.datas[0] || {}

        bonus_pagination.totalPageNum = Math.ceil(
          data.Count / bonus_pagination.perpageItemNum
        )
        if (bonus_pagination.totalPageNum == 0) {
          commonStore.showMessage("沒有您的購物金紀錄", false)
          bonus.value = null
          return
        } else {
          memberInfo.value.total_bonus = data.Total
          bonus.value = data.Bonuses
          bonus.value.forEach((item) => {
            if (item.Type.indexOf("使用點數") > -1) {
              item.FeedBack = -item.FeedBack
            }
          })
        }
      } else {
        commonStore.showMessage(res.msg, false)
        userStore.check_logout(res.msg)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // ---------------
  async function logoutHandler() {
    commonStore.user_account = ""
    useUrlPush("/user")
  }
  async function ajaxLogout() {
    try {
      const res = JSON.parse(await logoutApi())
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return ajaxLogout()

      logoutHandler()
    } catch (error) {
      throw new Error(error)
    }
  }

  // ---------------
  function bindLine() {
    useUrlPush(
      `${useRoute().path}/interface/webmember/LineLoginAuthorize?storeid=${
        commonStore.site.Name
      }&site=${commonStore.site.Site}&phone=${
        commonStore.user_account
      }&method=LineRegister`
    )
  }

  // ---------------
  async function unbindLine_test() {
    let isConfim = confirm("確定解除Line綁定嗎？")
    if (!isConfim) return

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account
    }

    try {
      const res = JSON.parse(await unbindLine_testApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return unbindLine_test()

      getMemberInfo()
    } catch (error) {
      throw new Error(error)
    }
  }
  async function deleteAccount_test() {
    let isConfim = confirm("確定刪除帳號嗎？")
    if (!isConfim) return

    let query = {
      storeid: commonStore.site.Name,
      phone: commonStore.user_account
    }

    try {
      const res = JSON.parse(await deleteAccount_testApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return deleteAccount_test()

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
      memberInfo.value.total_bonus = newV.Wallet * 1
    },
    { deep: true }
  )

  return {
    member_info_nav_active,

    memberInfo,
    e_form,

    bonus,
    bonus_pagination,

    getMemberInfo,
    login_handle_cart,

    createAddressObj,

    edit_info,
    edit_pass,

    add_address,
    delete_address,

    getBonus,

    logoutHandler,
    ajaxLogout,

    bindLine,

    unbindLine_test,
    deleteAccount_test
  }
})
