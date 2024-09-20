// stores
import { storeToRefs } from "pinia"
import { useCommonStore } from "@/stores/common"

// router
import { useRoute } from "vue-router"

export function useAuth() {
  let { user_account } = storeToRefs(useCommonStore())

  const { account, result } = useRoute().query

  if (process.browser) {
    user_account.value = localStorage.getItem("user_account") || ""

    if (account) {
      // Line 登入
      user_account.value = account
    }
    if (result) {
      // Line 綁定
      result = JSON.parse(decodeURI(result))
      if (!result.status) commonStore.showMessage(result.msg, false)
      else {
        user_account.value = result.account
      }
    }

    if (user_account.value) return true
  }

  return false
}
