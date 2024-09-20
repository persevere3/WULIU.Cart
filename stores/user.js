import { useRoute } from "vue-router"

import {
  getLineProfileApi,
  validateRecommenderCodeApi,
  registerApi,
  send_verify_codeApi,
  userLoginApi,
  send_forget_verify_codeApi,
  check_forget_verify_codeApi,
  edit_forget_passApi
} from "@/apis/user"

import { useVerify } from "@/composables/verify"
import { useRequest } from "@/composables/request"

export const useUserStore = defineStore("user", () => {
  const commonStore = useCommonStore()

  const { verify } = useVerify()
  const { return_formData } = useRequest()

  // state ==============================
  const r_form = reactive({
    recommender: {
      value: "",
      placeholder: "請輸入推薦人代碼"
    },

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
    sex: "male",
    birthday: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        }
      },
      is_error: false,
      message: "",
      readonly: false,
      placeholder: "* 請輸入生日",
      type: "date"
    },

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

    // 會員條款與隱私權政策
    is_member_and_privacy: false,

    is_agree: false
  })
  r_form.confirm_password.rules.confirm.password = r_form.password

  const l_form = reactive({
    account: {
      value: "0910456456",
      rules: {
        required: {
          message: "此項目為必填"
        }
      },
      is_error: false,
      message: "",
      placeholder: "* 請輸入帳號"
    },
    password: {
      value: "12345678",
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
      placeholder: "* 請輸入密碼",
      type: "password"
    }
  })

  const f_form = reactive({
    step: 1,
    // 0 信箱 1 手機
    mailOrAccount: 0,
    mail: {
      value: "",
      rules: {
        mail: {
          message: "email格式不符"
        }
      },
      is_error: false,
      message: "",
      placeholder: "* 請輸入電子信箱"
    },
    verify_code: {
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
      placeholder: "* 請輸入驗證碼"
    },
    second: 0,
    account: {
      value: "",
      rules: {
        cellphone: {
          message: "手機格式錯誤"
        }
      },
      is_error: false,
      message: "",
      placeholder: "* 請輸入手機"
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
          password: "password",
          message: "密碼不正確"
        }
      },
      is_error: false,
      message: "",
      placeholder: "* 請再次輸入密碼",
      type: "password",
      visible: false
    }
  })
  f_form.confirm_password.rules.confirm.password = f_form.password

  const o_password = ref({
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
    type: "password"
  })

  // getLineProfile
  const LineToken = ref(useRoute().query.code)

  const is_LineRegister = ref(false)

  // methods ==============================
  function reset_input(input) {
    input.value = ""
    input.is_error = false
    input.message = ""
  }

  async function getLineProfile() {
    try {
      const res = JSON.parse(await getLineProfileApi(LineToken.value))
      const isReqSuccess = commonStore.resHandler(res, getLineProfile)
      if (!isReqSuccess) return
    } catch (error) {
      throw new Error(error)
    }
  }

  //
  async function send_verify_code(form) {
    if (form.second > 0) return

    if (commonStore.store.NotificationSystem == 0) {
      if (!verify(form.mail)) return
    } else if (commonStore.store.NotificationSystem == 1) {
      if (!verify(form.phone)) return
    } else {
      if (!verify(form.phone) || !verify(form.mail)) return
    }

    let query = {
      storeid: commonStore.site.Name,
      storeName: commonStore.site.Store,
      phone: form.phone.value.trim(),
      mail: form.mail.value.trim(),
      type: commonStore.store.NotificationSystem,
      notificationsystem: commonStore.store.NotificationSystem
    }

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await send_verify_codeApi(formData))
      const isReqSuccess = commonStore.resHandler(res, send_verify_code)
      if (!isReqSuccess) return

      if (res.status) {
        form.second = 300
        let interval = setInterval(() => {
          form.second -= 1
          if (form.second < 1) {
            clearInterval(interval)
          }
        }, 1000)
        commonStore.showMessage(res.msg, true)
      } else {
        commonStore.showMessage(res.msg, false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  async function register() {
    if (commonStore.site.TermsNotices && !r_form.is_agree) return

    let verify_code = []
    if (commonStore.store.NotificationSystem == 0)
      verify_code.push(r_form.mail_verify_code)
    else if (commonStore.store.NotificationSystem == 1)
      verify_code.push(r_form.phone_verify_code)
    else {
      verify_code.push(r_form.phone_verify_code)
      verify_code.push(r_form.mail_verify_code)
    }

    if (
      !verify(
        r_form.name,
        r_form.mail,
        ...verify_code,
        r_form.birthday,
        r_form.phone,
        r_form.password,
        r_form.confirm_password
      )
    )
      return

    let query = {
      storeid: commonStore.site.Name,
      type: commonStore.store.NotificationSystem,
      recommender: r_form.recommender.value,
      name: r_form.name.value,
      email: r_form.mail.value,
      gender: r_form.sex == "male" ? 1 : 0,
      birthday: useFormatDate(r_form.birthday),
      phone: r_form.phone.value,
      password: r_form.password.value
    }
    if (commonStore.store.NotificationSystem == 0)
      query.validate2 = r_form.mail_verify_code.value
    else if (commonStore.store.NotificationSystem == 1)
      query.validate = r_form.phone_verify_code.value
    else {
      query.validate = r_form.phone_verify_code.value
      query.validate2 = r_form.mail_verify_code.value
    }

    try {
      const res = JSON.parse(await registerApi(query))
      const isReqSuccess = commonStore.resHandler(res, register)
      if (!isReqSuccess) return

      if (res.status) {
        commonStore.showMessage(res.msg, true)
        return true
      } else {
        commonStore.showMessage(res.msg, false)
        return false
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  //
  async function validateRecommenderCode() {
    if (!r_form.recommender.value) {
      LineLogin(true)
      return
    }

    let query = {
      storeid: commonStore.site.Name,
      recommender: r_form.recommender.value
    }

    try {
      const res = JSON.parse(await validateRecommenderCodeApi(query))
      const isReqSuccess = commonStore.resHandler(res, validateRecommenderCode)
      if (!isReqSuccess) return

      if (res.status) {
        commonStore.showMessage(res.msg, true)
        LineLogin(true)
      } else commonStore.showMessage(res.msg, false)
    } catch (error) {
      throw new Error(error)
    }
  }
  function LineLogin(isRegister) {
    useUrlPush(
      `${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${
        commonStore.site.Name
      }&site=${commonStore.site.Site}${
        isRegister
          ? `&recommender=${r_form.recommender.value}&method=Register`
          : ""
      }`
    )
  }
  async function user_login() {
    if (!verify(l_form.account, l_form.password)) return

    let query = {
      storeid: commonStore.site.Name,
      phone: l_form.account.value,
      password: l_form.password.value,
      realAccount: l_form.account.value
    }

    let formData = return_formData(query)

    try {
      const res = JSON.parse(await userLoginApi(formData))
      const isReqSuccess = commonStore.resHandler(res, user_login)
      if (!isReqSuccess) return

      if (res.status) {
        commonStore.user_account = l_form.account.value
        useUrlPush("/info")
      } else {
        commonStore.showMessage("請確認您的帳號密碼後重新登入", false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // forget ----------
  function getPhoneOrMail() {
    if (commonStore.store.NotificationSystem == 0)
      return f_form.mail.value.trim()
    else if (commonStore.store.NotificationSystem == 1)
      return f_form.account.value.trim()
    else
      return f_form.mailOrAccount == 0
        ? f_form.mail.value.trim()
        : f_form.account.value.trim()
  }
  async function send_forget_verify_code() {
    if (f_form.second > 0) return
    if (
      commonStore.store.NotificationSystem == 0 ||
      (commonStore.store.NotificationSystem == 2 && f_form.mailOrAccount == 0)
    ) {
      if (!verify(f_form.mail)) return
    } else if (
      commonStore.store.NotificationSystem == 1 ||
      (commonStore.store.NotificationSystem == 2 && f_form.mailOrAccount == 1)
    ) {
      if (!verify(f_form.account)) return
    }

    let query = {
      storeid: commonStore.site.Name,
      storeName: commonStore.site.Store,
      notificationsystem: commonStore.store.NotificationSystem,
      phoneormail: getPhoneOrMail()
    }

    try {
      const res = JSON.parse(await send_forget_verify_codeApi(query))
      const isReqSuccess = commonStore.resHandler(res, send_forget_verify_code)
      if (!isReqSuccess) return

      if (res.status) {
        reset_input(f_form.verify_code)
        f_form.step = 2

        f_form.second = 300
        let interval = setInterval(() => {
          f_form.second -= 1
          if (f_form.second < 1) {
            clearInterval(interval)
          }
        }, 1000)
      } else {
        commonStore.showMessage(res.msg, false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  async function check_forget_verify_code() {
    if (!verify(f_form.verify_code)) return

    let query = {
      storeid: commonStore.site.Name,
      phoneormail: getPhoneOrMail(),
      validate: f_form.verify_code.value
    }

    try {
      const res = JSON.parse(await check_forget_verify_codeApi(query))
      const isReqSuccess = commonStore.resHandler(res, check_forget_verify_code)
      if (!isReqSuccess) return

      if (res.status) {
        reset_input(f_form.password)
        reset_input(f_form.confirm_password)
        f_form.step = 3

        commonStore.showMessage(res.msg, true)
      } else {
        commonStore.showMessage(res.msg, false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  async function edit_forget_pass() {
    if (!verify(f_form.password, f_form.confirm_password)) return

    let query = {
      storeid: commonStore.site.Name,
      phoneormail: getPhoneOrMail(),
      validate: f_form.verify_code.value,
      newpassword: f_form.password.value
    }

    try {
      const res = JSON.parse(await edit_forget_passApi(query))
      const isReqSuccess = commonStore.resHandler(res, edit_forget_pass)
      if (!isReqSuccess) return

      if (res.status) {
        reset_input(f_form.account)
        reset_input(f_form.mail)
        reset_input(f_form.verify_code)
        reset_input(f_form.password)
        reset_input(f_form.confirm_password)

        f_form.step = 1
        activeUserNav.value = "login"

        commonStore.showMessage(res.msg, true)
      } else {
        commonStore.showMessage(res.msg, false)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // msg.indexOf('登入') > -1 ----------
  function check_logout(msg) {
    if (
      msg == "請先登入會員" ||
      msg == "閒置逾時，請重新登入" ||
      msg == "已登出，請重新登入"
    )
      commonStore.is_logout = true
  }

  return {
    r_form,
    l_form,
    f_form,

    o_password,

    LineToken,

    is_LineRegister,

    reset_input,

    getLineProfile,

    send_verify_code,
    register,

    validateRecommenderCode,
    LineLogin,
    user_login,

    getPhoneOrMail,
    send_forget_verify_code,
    check_forget_verify_code,
    edit_forget_pass,

    check_logout
  }
})
