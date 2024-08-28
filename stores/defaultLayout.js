import { connectHandlerApi } from "@/apis/common"

import { useVerify } from "@/composables/verify"

export const useDefaultLayoutStore = defineStore("defaultLayout", () => {
  const commonStore = useCommonStore()

  // state ==============================
  const state = reactive({
    window_scrollTop: 0,

    // search
    is_search: false,
    searchStr: "",

    // connect
    is_connect: false,
    connect_mail: {
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
    connect_text: {
      value: "",
      rules: {
        required: {
          message: "此項目為必填"
        }
      }
    },

    // sidebar
    is_sidebar: false,
    is_slideout: false
  })

  // methods ==============================
  const methods = {
    // search
    close_search() {
      state.is_search = false
      state.searchStr = ""
    },
    searchHandler() {
      if (state.searchStr) {
        useUrlPush(`/search?query=${state.searchStr}&type=0`)
      }
    },

    // connect
    open_connect() {
      if (commonStore.site.WebPreview == 2) alert("預覽模式下不開放")
      else {
        state.is_sidebar = false
        state.is_slideout = false
        state.is_connect = true
      }
    },
    close_connect() {
      state.is_connect = false

      reset(state.connect_mail)
      reset(state.connect_text)
    },
    async connectHandler() {
      let isValid = verify(state.connect_mail, state.connect_text)
      if (!isValid) return
      else {
        let query = {
          title: state.connect_mail.value,
          text: state.connect_text.value,
          WebPreview: commonStore.site.WebPreview
        }

        try {
          const res = JSON.parse(await connectHandlerApi())
          const isReqSuccess = resHandler(res, connectHandler)
          if (!isReqSuccess) return

          state.is_connect = false

          useVerify.reset(state.connect_mail)
          useVerify.reset(state.connect_text)

          alert("發送成功")
        } catch (error) {
          throw new Error(error)
        }
      }
    },

    // sidebar
    open_sidebar() {
      state.is_sidebar = true
      setTimeout(function () {
        state.is_slideout = true
      }, 100)
    },
    close_sidebar() {
      state.is_slideout = false
      setTimeout(function () {
        state.is_sidebar = false
      }, 350)
    }
  }

  return {
    ...toRefs(state),

    ...methods
  }
})
