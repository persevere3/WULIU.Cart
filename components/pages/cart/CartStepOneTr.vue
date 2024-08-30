<template>
  <div class="tr p-1">
    <div class="td picName">
      <div
        class="pic"
        :style="{
          backgroundImage: `url(${
            addProduct ? product.Img : product.imgArr[0]
          })`
        }"
      >
        <div class="tag" v-if="addProduct">加價購</div>
      </div>
      <div class="name">{{ product.Name }}</div>
    </div>
    <div class="td spec">
      <template v-if="spec">
        <!-- rwd -->
        <div
          class="specButton"
          @click="
            cartSpecCheckedId = cartSpecCheckedId == spec.ID ? -1 : spec.ID
          "
        >
          規格
          <i
            :class="{ iActive: cartSpecCheckedId == spec.ID }"
            class="fa fa-caret-down"
            aria-hidden="true"
          ></i>
        </div>
        <div
          class="specText"
          :class="{ specTextShow: cartSpecCheckedId == spec.ID }"
        >
          {{ spec.Name }}
        </div>
      </template>
    </div>

    <!-- 多價格 cart table 單價 -->
    <div
      class="td price"
      v-if="
        product.priceType === 'onePrice' || product.priceType === 'onePrice'
      "
    >
      NT$ {{ useNumberThousands(product[addProduct ? "Price" : "NowPrice"]) }}
    </div>
    <div class="td price" v-else>
      NT$ {{ useNumberThousands(productSpec.ItemNowPrice) }}
    </div>

    <div class="td qty">
      <ProductBuyQtyBox
        :main="main"
        :addProduct="addProduct"
        :assignIndex="specIndex"
      />
    </div>

    <div class="td subtotal">
      <div class="subtotalTitle">小計</div>

      <!-- 多價格 cart table 小計 -->
      <div
        class="subtotalText"
        v-if="
          product.priceType === 'onePrice' || product.priceType === 'onePrice'
        "
      >
        NT$
        {{
          useNumberThousands(
            product[addProduct ? "Price" : "NowPrice"] *
              (isNaN(buyQty) ? 0 : buyQty)
          )
        }}
      </div>
      <div class="subtotalText" v-else>
        NT$
        {{
          useNumberThousands(
            productSpec.ItemNowPrice * (isNaN(buyQty) ? 0 : buyQty)
          )
        }}
      </div>
    </div>

    <div class="td delete">
      <div
        class="button"
        @click="
          !addProduct
            ? buyQtyHandlerStore.changeMainBuyQty(product, specIndex, 0)
            : buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addProductIndex,
                specIndex,
                0
              )
        "
      >
        刪除
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductBuyQtyBox from "@/components/ProductBuyQtyBox.vue"

import { useNumberThousands } from "@/composables/numberThousands"

const commonStore = useCommonStore()
const cartStore = useCartStore()
const buyQtyHandlerStore = useBuyQtyHandlerStore()

// props ========== ========== ========== ========== ==========
const props = defineProps(["main", "addProduct", "spec", "cartSpecCheckedId"])

// computed ========== ========== ========== ========== ==========
const product = computed(() => {
  return props.addProduct ? props.addProduct : props.main
})

const productSpec = computed(() => {
  return props.spec ? props.spec : product.value
})

const addProductIndex = computed(() => {
  if (props.addProduct) {
    return props.main.addProducts
      .map((item) => item.ID)
      .indexOf(props.addProduct.ID)
  }
  return null
})

const specIndex = computed(() => {
  if (props.spec) {
    return product.value.specArr.map((item) => item.ID).indexOf(props.spec.ID)
  }
  return null
})

const buyQty = computed({
  get() {
    return productSpec.value["buyQty"]
  },
  set(newBuyQty) {
    productSpec.value["buyQty"] = newBuyQty
  }
})
</script>
