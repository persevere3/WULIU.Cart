<script setup>
import CartStepOneTr from "./CartStepOneTr.vue"
import CartStepTotal from "./CartStepTotal.vue"

const commonStore = useCommonStore()
const cartStore = useCartStore()

const activeCartSpecId = ref({
  value: -1
})
</script>

<template>
  <div class="stepOne">
    <div class="table">
      <div class="thead">
        <div class="th picName">商品</div>
        <div class="th spec">規格</div>
        <div class="th price">單價</div>
        <div class="th qty">數量</div>
        <div class="th subtotal">小計</div>
        <div class="th delete"></div>
      </div>
      <div class="tbody">
        <div v-for="item in cartStore.cart">
          <!-- 有規格 -->
          <template v-if="item.specArr">
            <template v-for="spec in item.specArr" :key="spec.ID">
              <CartStepOneTr
                v-if="spec.buyQty > 0"
                :main="item"
                :spec="spec"
                :activeCartSpecId="activeCartSpecId"
              />
            </template>
          </template>
          <!-- 沒有規格 -->
          <template v-else>
            <CartStepOneTr v-if="item.buyQty > 0" :main="item" />
          </template>

          <!-- 加價購 -->
          <template v-if="item.addProducts">
            <div v-for="item2 in item.addProducts">
              <!-- 有規格 -->
              <template v-if="item2.specArr">
                <template v-for="spec2 in item2.specArr" :key="spec2.ID">
                  <CartStepOneTr
                    v-if="spec2.buyQty > 0"
                    :main="item"
                    :addProduct="item2"
                    :spec="spec2"
                    :activeCartSpecId="activeCartSpecId"
                  />
                </template>
              </template>
              <!-- 沒有規格 -->
              <template v-else>
                <CartStepOneTr
                  v-if="item2.buyQty > 0"
                  :main="item"
                  :addProduct="item2"
                />
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="discount" v-if="commonStore.store">
      <p v-show="commonStore.store.Discount == 1" class="notice">
        消費滿{{ commonStore.store.Price }}元 ，折扣{{
          commonStore.store.Ratio
        }}元 。
      </p>
      <p v-show="commonStore.store.Discount == 2" class="notice">
        消費滿{{ commonStore.store.Price }}元 ，打{{
          (100 - commonStore.store.Ratio) % 10 === 0
            ? (100 - commonStore.store.Ratio) / 10
            : 100 - commonStore.store.Ratio
        }}折 。
      </p>
      <p>如果要使用折扣碼，請在此填入</p>
      <div class="discountBox">
        <input
          type="text"
          v-model.trim="cartStore.discountCode"
          @keyup.enter="cartStore.discount"
        />
        <div class="button" @click="cartStore.discount">套用</div>
        <div class="button" @click="cartStore.unDiscount">取消</div>
      </div>
      <div class="discountErrorMessage" v-if="cartStore.discountErrorMessage">
        {{ cartStore.discountErrorMessage }}
      </div>
    </div>

    <CartStepTotal />

    <div class="button" @click="cartStore.step = 2">下一步</div>
  </div>
</template>
