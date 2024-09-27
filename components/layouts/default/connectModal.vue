<template>
  <div
    class="connect_container"
    :class="{ active: defaultLayoutStore.is_connect }"
    @click="defaultLayoutStore.close_connect"
  >
    <div class="connect" @click.stop="">
      <div class="text">聯絡我們</div>
      <input
        type="text"
        placeholder="輸入您的電子信箱"
        :class="{ error_border: defaultLayoutStore.connect_mail.is_error }"
        v-model="defaultLayoutStore.connect_mail.value"
        @input="verify(defaultLayoutStore.connect_mail)"
      />
      <div class="error_color" v-if="defaultLayoutStore.connect_mail.message">
        {{ defaultLayoutStore.connect_mail.message }}
      </div>

      <textarea
        rows="5"
        placeholder="輸入您的訊息。若是詢問店內特定商品，請留下商品名稱，也歡迎你留下電子信箱以外的聯絡方式，謝謝！"
        :class="{ error_border: defaultLayoutStore.connect_text.is_error }"
        v-model.trim="defaultLayoutStore.connect_text.value"
        @input="verify(defaultLayoutStore.connect_text)"
      ></textarea>
      <div class="error_color" v-if="defaultLayoutStore.connect_text.message">
        {{ defaultLayoutStore.connect_text.message }}
      </div>

      <div class="connect_button_container">
        <div class="connect_button" @click="defaultLayoutStore.connectHandler">
          發送
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVerify } from "@/composables/verify"

const defaultLayoutStore = useDefaultLayoutStore()

let { verify } = useVerify()
</script>
