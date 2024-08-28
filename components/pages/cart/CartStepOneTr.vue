<template>
  <div class="tr p-1">
    <div class="td picName">
      <div
        class="pic"
        :style="{
          backgroundImage: `url(${addPrice ? product.Img : product.imgArr[0]})`
        }"
      >
        <div class="tag" v-if="addPrice">加價購</div>
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
      NT$ {{ useNumberThousands(product[addPrice ? "Price" : "NowPrice"]) }}
    </div>
    <div class="td price" v-else>
      NT$ {{ useNumberThousands(productSpec.ItemNowPrice) }}
    </div>

    <div class="td qty">
      <div class="qtyBox" v-show="commonStore.store?.Enable === '1'">
        <template v-if="!addPrice">
          <div
            class="reduce"
            :class="{ qtyDisabled: buyQty < 1 }"
            @click="
              buyQtyHandlerStore.changeMainBuyQty(
                product,
                specIndex,
                buyQty - 1
              )
            "
          >
            <i class="fa fa-minus"></i>
          </div>
          <input
            type="text"
            class="number"
            size="3"
            maxlength="3"
            v-model="buyQty"
            @keyup.enter="
              buyQtyHandlerStore.changeMainBuyQty(product, specIndex, buyQty)
            "
            @blur="
              buyQtyHandlerStore.changeMainBuyQty(product, specIndex, buyQty)
            "
          />
          <div
            class="add"
            :class="{
              qtyDisabled:
                (productSpec.Enable == 1 && buyQty > productSpec.Amount - 1) ||
                buyQty > 998
            }"
            @click="
              buyQtyHandlerStore.changeMainBuyQty(
                product,
                specIndex,
                buyQty * 1 + 1
              )
            "
          >
            <i class="fa fa-plus"></i>
          </div>
        </template>
        <template v-else>
          <div
            class="reduce"
            :class="{ qtyDisabled: buyQty < 1 }"
            @click="
              buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addPriceIndex,
                specIndex,
                buyQty - 1
              )
            "
          >
            <i class="fa fa-minus"></i>
          </div>
          <input
            type="text"
            class="number"
            size="3"
            maxlength="3"
            v-model="buyQty"
            @keyup.enter="
              buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addPriceIndex,
                specIndex,
                buyQty
              )
            "
            @blur="
              buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addPriceIndex,
                specIndex,
                buyQty
              )
            "
          />
          <div
            class="add"
            :class="{
              qtyDisabled:
                buyQty > cartStore.getMainTotalQty(main) - 1 ||
                (productSpec.Enable == 1 && buyQty > productSpec.Amount - 1) ||
                buyQty > 998
            }"
            @click="
              buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addPriceIndex,
                specIndex,
                buyQty * 1 + 1
              )
            "
          >
            <i class="fa fa-plus"></i>
          </div>
        </template>
      </div>
      <div class="discontinued" v-show="commonStore.store?.Enable === '0'">
        停售中
      </div>
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
            product[addPrice ? "Price" : "NowPrice"] *
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
          !addPrice
            ? buyQtyHandlerStore.changeMainBuyQty(product, specIndex, 0)
            : buyQtyHandlerStore.changeAddProductBuyQty(
                main,
                addPriceIndex,
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
import { useNumberThousands } from "@/composables/numberThousands"

const commonStore = useCommonStore()
const cartStore = useCartStore()
const buyQtyHandlerStore = useBuyQtyHandlerStore()

// props ========== ========== ========== ========== ==========
const props = defineProps(["main", "addPrice", "spec", "cartSpecCheckedId"])

// computed ========== ========== ========== ========== ==========
const product = computed(() => {
  return props.addPrice ? props.addPrice : props.main
})

const productSpec = computed(() => {
  return props.spec ? props.spec : product.value
})

const addPriceIndex = computed(() => {
  if (props.addPrice) {
    return props.main.addProducts
      .map((item) => item.ID)
      .indexOf(props.addPrice.ID)
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
