<script setup>
import cartStepOne from "./CartStepOne.vue"
import cartStepTwo from "./CartStepTwo.vue"

import { useUrlPush } from "@/composables/urlPush"

const commonStore = useCommonStore()
const memberInfoStore = useMemberInfoStore()
const cartStore = useCartStore()

const { step } = storeToRefs(cartStore)
watch(step, (newV) => {
  cartStore.getTotal(newV - 1)
  if (newV == 2 && commonStore.user_account) memberInfoStore.getMemberInfo()
})

const { successUsedDiscountCode } = storeToRefs(cartStore)
watch(successUsedDiscountCode, () => {
  if (step.value > 0) cartStore.getTotal(step.value - 1)
})
</script>

<template>
  <div class="productContainer">
    <div class="step">
      <div class="stepItem" :class="{ stepItemActive: step === 1 }">
        <div class="icon">1</div>
        <p>確認購物車</p>
      </div>
      <div class="arrow" :class="{ arrowActive: step === 1 }">
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </div>
      <div class="stepItem" :class="{ stepItemActive: step === 2 }">
        <div class="icon">2</div>
        <p>付款與運送方式</p>
      </div>
      <div class="arrow" :class="{ arrowActive: step === 2 }">
        <i class="fa fa-arrow-right" aria-hidden="true"></i>
      </div>
      <div class="stepItem" :class="{ stepItemActive: step === 3 }">
        <div class="icon">3</div>
        <p>完成訂單</p>
      </div>
    </div>

    <cartStepOne v-if="cartStore.cartLength !== 0 && step === 1" />
    <cartStepTwo v-if="cartStore.cartLength !== 0 && step === 2" />

    <div class="noItem" v-if="cartStore.cartLength === 0">
      <p>購物車是空的??</p>
      <p>趕緊手刀買起來!!</p>
      <div class="button" @click="useUrlPush('/products')">現在就去逛!</div>
    </div>

    <!-- <div class="footer">POWERED AND SECURED BY</div> -->
  </div>
</template>

<style lang="scss">
@import "@/styles/pages/cart.scss";

.productContainer {
  width: 1170px;
  padding: 15px;
  margin: 0 auto;

  @include xl {
    width: 970px;
  }
  @include l {
    width: 750px;
  }
  @include m {
    width: 100%;
  }
}
</style>
