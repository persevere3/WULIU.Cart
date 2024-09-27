<template>
  <div class="total">
    <ul>
      <li>
        <div class="before">商品金額</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.total.Total) }}
        </div>
      </li>
      <li v-if="cartStore.total.Discount > 0">
        <div class="before">- 折扣</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.total.Discount) }}
        </div>
      </li>
      <li v-if="cartStore.total.DiscountCode > 0">
        <div class="before">- 折扣碼優惠</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.total.DiscountCode) }}
        </div>
      </li>
      <li>
        <div class="before">小計</div>
        <div class="after" v-if="subtotal >= 0">
          NT$ {{ useNumberThousands(subtotal) }}
        </div>
        <div class="after" v-else>NT$ 0</div>
      </li>
      <li class="line"></li>
      <li
        v-if="
          commonStore.user_account &&
          cartStore.is_use_bonus &&
          cartStore.use_bonus > 0
        "
      >
        <div class="before">- 購物金</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.use_bonus) }}
        </div>
      </li>
      <li v-if="cartStore.step === 2">
        <div class="before">+ 運費</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.total.Shipping) }}
        </div>
      </li>
      <li>
        <div class="before">金額總計</div>
        <div class="after">
          NT$ {{ useNumberThousands(cartStore.total.Sum) }}
        </div>
      </li>
      <template v-if="commonStore.user_account">
        <li class="line"></li>
        <li>
          訂單完成後獲得 NT${{ useNumberThousands(cartStore.member_bonus) }}
          購物金
        </li>
        <li>(購物金將在出貨日滿14天後獲得)</li>
      </template>
    </ul>
  </div>
</template>

<script setup>
import { useNumberThousands } from "@/composables/numberThousands"

const commonStore = useCommonStore()
const cartStore = useCartStore()

let subtotal = computed(() => {
  return (
    parseInt(cartStore.total.Total) -
    parseInt(cartStore.total.Discount) -
    parseInt(cartStore.total.DiscountCode)
  )
})

watch(
  () => commonStore.is_initial,
  (v) => {
    if (v) cartStore.getTotal(cartStore.step - 1)
  }
)

const { successUsedDiscountCode } = storeToRefs(cartStore)
watch(successUsedDiscountCode, () => {
  cartStore.getTotal(cartStore.step - 1)
})
</script>
