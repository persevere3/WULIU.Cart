<script setup>
import RegisterForm from "@/components/registerForm/index.vue"
import c_input from "@/components/registerForm/Input.vue"

const commonStore = useCommonStore()
const userStore = useUserStore()

async function user_register() {
  const res = await userStore.register()
  if (res) {
    userStore.l_form.account.value = userStore.r_form.phone.value
    userStore.l_form.password.value = userStore.r_form.password.value
    userStore.user_login()
  }
}

const { term, code } = useRoute().query

onMounted(() => {
  if (commonStore.site.TermsNotices && term) {
    userStore.activeUserNav = "register"
    userStore.r_form.is_member_and_privacy = true
  }

  // Line token
  if (code) {
    userStore.getLineProfile()
  }

  useRouter().replace({ path: useRoute().name })
})
</script>

<template>
  <div class="user" v-if="commonStore.is_initial">
    <div class="navs">
      <div
        class="nav"
        :class="{ active: userStore.activeUserNav === 'register' }"
        @click="userStore.activeUserNav = 'register'"
      >
        註冊會員
      </div>
      <div
        class="nav"
        :class="{ active: userStore.activeUserNav === 'login' }"
        @click="userStore.activeUserNav = 'login'"
      >
        會員登入
      </div>
      <div
        class="nav"
        :class="{ active: userStore.activeUserNav === 'forget' }"
        @click="userStore.activeUserNav = 'forget'"
      >
        忘記密碼
      </div>
    </div>

    <div class="forms">
      <div class="form" v-show="userStore.activeUserNav === 'register'">
        <RegisterForm />

        <div
          class="button"
          :class="{ disabled: !userStore.r_form.is_agree }"
          @click="user_register"
        >
          註冊
        </div>
      </div>

      <div class="form" v-show="userStore.activeUserNav === 'login'">
        <c_input :input="userStore.l_form.account" />
        <c_input :input="userStore.l_form.password" />

        <div class="button" @click="userStore.user_login">登入</div>
      </div>

      <div class="form" v-show="userStore.activeUserNav === 'forget'">
        <template v-if="userStore.f_form.step == 1">
          <select
            v-if="commonStore.store.NotificationSystem == 2"
            v-model="userStore.f_form.mailOrAccount"
          >
            <option value="0">電子信箱</option>
            <option value="1">手機</option>
          </select>

          <c_input
            v-if="
              commonStore.store.NotificationSystem == 0 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 0)
            "
            :input="userStore.f_form.mail"
          />

          <c_input
            v-if="
              commonStore.store.NotificationSystem == 1 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 1)
            "
            :input="userStore.f_form.account"
          />

          <div class="button" @click="userStore.send_forget_verify_code">
            獲取驗證碼
            <span v-if="userStore.f_form.second > 0">
              ( {{ userStore.f_form.second }}s )
            </span>
          </div>
        </template>

        <template v-if="userStore.f_form.step == 2">
          <c_input class="verify" :input="userStore.f_form.verify_code" />

          <div class="button" @click="userStore.check_forget_verify_code">
            送出
          </div>

          <div
            class="button"
            @click="
              userStore.reset_input(userStore.f_form.mail),
                (userStore.f_form.step = 1)
            "
            v-if="
              commonStore.store.NotificationSystem == 0 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 0)
            "
          >
            重新輸入電子信箱
          </div>
          <div
            class="button"
            @click="
              userStore.reset_input(userStore.f_form.account),
                (userStore.f_form.step = 1)
            "
            v-if="
              commonStore.store.NotificationSystem == 1 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 1)
            "
          >
            重新輸入手機
          </div>
        </template>

        <template v-if="userStore.f_form.step == 3">
          <c_input class="verify" :input="userStore.f_form.password" />

          <c_input class="verify" :input="userStore.f_form.confirm_password" />

          <div class="button" @click="userStore.edit_forget_pass">確認修改</div>

          <div
            class="button"
            @click="
              userStore.reset_input(userStore.f_form.mail),
                (userStore.f_form.step = 1)
            "
            v-if="
              commonStore.store.NotificationSystem == 0 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 0)
            "
          >
            重新輸入電子信箱
          </div>

          <div
            class="button"
            @click="
              userStore.reset_input(userStore.f_form.account),
                (userStore.f_form.step = 1)
            "
            v-if="
              commonStore.store.NotificationSystem == 1 ||
              (commonStore.store.NotificationSystem == 2 &&
                userStore.f_form.mailOrAccount == 1)
            "
          >
            重新輸入手機
          </div>
        </template>
      </div>
    </div>

    <div class="third_login" v-if="userStore.activeUserNav != 'forget'">
      <div
        class="button"
        style="background-color: #00c300"
        @click="
          userStore.activeUserNav === 'login'
            ? userStore.LineLogin()
            : (userStore.is_LineRegister = true)
        "
      >
        <i class="fa-brands fa-line"></i>
        使用Line
        <span v-if="userStore.activeUserNav === 'register'">註冊</span>
        <span v-if="userStore.activeUserNav === 'login'">登入</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/pages/user.scss";
</style>
