import { useRoute } from "vue-router"

import { useVerify } from "@/composables/verify"

// apis ========== ========== ========== ========== ==========
import {
  getLineProfileApi,
  validateRecommenderCodeApi,
  registerApi,
  userLoginApi,
  send_forget_verify_codeApi,
  check_forget_verify_codeApi,
  edit_forget_passApi
} from "@/apis/user"

export const useUserStore = defineStore("user", () => {
  const commonStore = useCommonStore()

  const { verify } = useVerify()

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
      readonly: true,
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
    phone2: {
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
      readonly: true,
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

    account: {
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
      message: ""
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

    // 會員條款與隱私權政策
    is_member_and_privacy: false,

    is_agree: false
  })
  r_form.confirm_password.rules.confirm.password = r_form.password

  const l_form = reactive({
    account: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        }
      },
      is_error: false,
      message: ""
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
      message: ""
    },
    password_type: "password"
  })

  const f_form = reactive({
    step: 1,
    mailOrAccount: 0,
    mail: {
      value: "",
      rules: {
        mail: {
          message: "email格式不符"
        }
      },
      is_error: false,
      message: ""
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
      message: ""
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
      message: ""
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
      message: ""
    },
    password_type: "password",
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
      message: ""
    },
    confirm_password_type: "password"
  })

  const user_nav_active = ref("login")

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
    message: ""
  })

  const o_password_type = ref("password")

  // getLineProfile
  const LineToken = ref(useRoute().query.code)

  const is_LineRegister = ref(false)

  const is_userModal = ref(false)

  const is_userMessage = ref(false)
  const user_message = ref("")

  // methods ==============================
  const methods = {
    // forget
    getPhoneOrMail() {
      if (commonStore.store.NotificationSystem == 0) return f_form.mail.trim()
      else if (commonStore.store.NotificationSystem == 1)
        return f_form.account.trim()
      else
        return f_form.mailOrAccount == 0
          ? f_form.mail.trim()
          : f_form.account.trim()
    },

    reset_input(input) {
      input.value = ""
      input.is_error = false
      input.message = ""
    },

    async getLineProfile() {
      try {
        const res = await getLineProfileApi(LineToken.value)
        const isReqSuccess = commonStore.resHandler(res, getLineProfile)
        if (!isReqSuccess) return
      } catch (error) {
        throw new Error(error)
      }
    },

    async validateRecommenderCode() {
      if (!r_form.recommender.value) {
        LineLogin(true)
        return
      }

      let query = {
        storeid: commonStore.site.Name,
        recommender: r_form.recommender.value
      }

      try {
        const res = await validateRecommenderCodeApi(query)
        const isReqSuccess = commonStore.resHandler(
          res,
          validateRecommenderCode
        )
        if (!isReqSuccess) return

        alert(res.msg)
        if (res.status) LineLogin(true)
      } catch (error) {
        throw new Error(error)
      }
    },
    LineLogin(isRegister) {
      useUrlPush(
        `${location.origin}/interface/webmember/LineLoginAuthorize?storeid=${
          commonStore.site.Name
        }&site=${commonStore.site.Site}${
          isRegister
            ? `&recommender=${r_form.recommender.value}&method=Register`
            : ""
        }`
      )
    },

    async send_verify_code() {
      if (r_form.second > 0) return

      if (commonStore.store.NotificationSystem == 0) {
        if (!verify(r_form.mail)) return
      } else if (commonStore.store.NotificationSystem == 1) {
        if (!verify(r_form.phone2)) return
      } else {
        if (!verify(r_form.phone2) || !verify(r_form.mail)) return
      }

      let query = {
        storeid: commonStore.site.Name,
        storeName: commonStore.site.Store,
        phone: r_form.phone2.value.trim(),
        mail: r_form.mail.value.trim(),
        type: commonStore.store.NotificationSystem,
        notificationsystem: commonStore.store.NotificationSystem
      }
      try {
        const res = await send_verify_codeApi(query)
        const isReqSuccess = commonStore.resHandler(res, send_verify_code)
        if (!isReqSuccess) return

        if (res.status) {
          r_form.second = 300
          let interval = setInterval(() => {
            r_form.second -= 1
            if (r_form.second < 1) {
              clearInterval(interval)
            }
          }, 1000)
        }
        user_message.value = res.msg
        is_userMessage.value = true

        // commonStore.showMessage(res.data.msg, true)
      } catch (error) {
        throw new Error(error)
      }
    },
    async register() {
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
          r_form.phone2,
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
        phone: r_form.phone2.value,
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
        const res = await registerApi(query)
        const isReqSuccess = commonStore.resHandler(res, register)
        if (!isReqSuccess) return

        if (res.status) {
          user_message.value = res.msg
          is_userMessage.value = true
          // commonStore.showMessage(res.msg, false)
          return true
        } else {
          user_message.value = res.msg
          is_userMessage.value = true
          // commonStore.showMessage(res.msg, false)
          return false
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    async user_login() {
      if (!verify(l_form.account, l_form.password)) return

      let query = {
        storeid: commonStore.site.Name,
        phone: l_form.account.value,
        password: l_form.password.value,
        realAccount: l_form.account.value
      }

      try {
        const res = await userLoginApi(query)
        const isReqSuccess = commonStore.resHandler(res, user_login)
        if (!isReqSuccess) return

        if (res.status) {
          localStorage.setItem("user_account", l_form.account.value)
          user_account.value = l_form.account.value

          useUrlPush("/info.html")
        } else {
          user_message.value = "請確認您的帳號密碼後重新登入"
          is_userMessage.value = true
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    async send_forget_verify_code() {
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
        const res = await send_verify_codeApi(query)
        const isReqSuccess = commonStore.resHandler(
          res,
          send_forget_verify_code
        )
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
          user_message.value = res.msg
          is_userMessage.value = true
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    async check_forget_verify_code() {
      if (!verify(f_form.verify_code)) return

      let query = {
        storeid: commonStore.site.Name,
        phoneormail: getPhoneOrMail(),
        validate: f_form.verify_code.value
      }

      try {
        const res = await check_forget_verify_codeApi(query)
        const isReqSuccess = commonStore.resHandler(
          res,
          check_forget_verify_code
        )
        if (!isReqSuccess) return

        user_message.value = res.msg
        is_userMessage.value = true

        if (res.status) {
          reset_input(f_form.password)
          reset_input(f_form.confirm_password)
          f_form.step = 3
        }
      } catch (error) {
        throw new Error(error)
      }
    },

    async edit_forget_pass() {
      if (!verify(f_form.password, f_form.confirm_password)) return

      let query = {
        storeid: commonStore.site.Name,
        phoneormail: getPhoneOrMail(),
        validate: f_form.verify_code.value,
        newpassword: f_form.password.value
      }

      try {
        const res = await edit_forget_passApi(query)
        const isReqSuccess = commonStore.resHandler(res, edit_forget_pass)
        if (!isReqSuccess) return

        user_message.value = res.msg
        is_userMessage.value = true

        if (res.status) {
          methods.reset_input(f_form.account)
          methods.reset_input(f_form.mail)
          methods.reset_input(f_form.verify_code)
          methods.reset_input(f_form.password)
          methods.reset_input(f_form.confirm_password)

          f_form.step = 1
          user_nav_active.value = "login"
        }
      } catch (error) {
        throw new Error(error)
      }
    }
  }

  return {
    r_form,
    // ...toRefs(state),

    ...methods
  }
})
