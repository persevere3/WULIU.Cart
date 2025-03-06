<script setup>
import cartStepOne from "./CartStepOne.vue"
import cartStepTwo from "./CartStepTwo.vue"

import { useUrlPush } from "@/composables/urlPush"

const cartStore = useCartStore()
const purchaseInfoStore = usePurchaseInfoStore()

onMounted(() => {
  if (!purchaseInfoStore.notEstablishedOrderInfo.OrderFirstPayTime) {
    purchaseInfoStore.notEstablishedOrderInfo.OrderFirstPayTime = useFormatDate(
      new Date(),
      "-",
      "time"
    )
  }
})
</script>

<template>
  <div class="cartContent">
    <div class="step">
      <div class="stepItem" :class="{ stepItemActive: cartStore.step === 1 }">
        <div class="icon">1</div>
        <p>確認購物車</p>
      </div>
      <div class="arrow" :class="{ arrowActive: cartStore.step === 1 }">
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </div>
      <div class="stepItem" :class="{ stepItemActive: cartStore.step === 2 }">
        <div class="icon">2</div>
        <p>付款與配送狀態</p>
      </div>
      <div class="arrow" :class="{ arrowActive: cartStore.step === 2 }">
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </div>
      <div class="stepItem" :class="{ stepItemActive: cartStore.step === 3 }">
        <div class="icon">3</div>
        <p>完成訂單</p>
      </div>
    </div>
    <cartStepOne v-if="cartStore.cartLength !== 0 && cartStore.step === 1" />
    <cartStepTwo v-if="cartStore.cartLength !== 0 && cartStore.step === 2" />

    <div class="noItem" v-if="cartStore.cartLength === 0">
      <p>購物車是空的??</p>
      <p>趕緊手刀買起來!!</p>
      <div class="button" @click="useUrlPush('/products')">現在就去逛!</div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/styles/pages/cart.scss";
</style>
