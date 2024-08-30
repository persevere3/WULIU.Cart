<script setup>
import { useNumberThousands } from "@/composables/numberThousands"
const cartStore = useCartStore()
const buyQtyHandlerStore = useBuyQtyHandlerStore()

const modal = ref(null)

//
function closeModal() {
  cartStore.is_cart_modal = false
}

function handleClickOutside(event) {
  if (modal.value && !modal.value.contains(event.target)) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<template>
  <div
    ref="modal"
    class="cart_container"
    :class="{ active: cartStore.is_cart_modal }"
    v-if="cartStore.cart.length"
  >
    <ul class="items">
      <template v-for="item in cartStore.cart" :key="item.ID">
        <!-- 有規格 -->
        <template v-if="item.specArr">
          <template v-for="(spec, specIndex) in item.specArr" :key="spec.ID">
            <li v-if="spec.buyQty != 0 || spec.buyQty === ''">
              <nuxt-link :to="`/product/${item.ID}`">
                <div class="img_and_name">
                  <div
                    class="img"
                    :style="{ backgroundImage: `url(${item.Img1})` }"
                  ></div>
                  <div class="name">{{ item.Name }}({{ spec.Name }})</div>
                </div>
                <div class="price_and_delete">
                  <!-- 多價格 cart_container 主商品 小計 -->
                  <div class="price" v-if="item.priceType === 'onePrice'">
                    NT${{ useNumberThousands(item.NowPrice) }} x
                    {{ spec.buyQty }}
                  </div>
                  <div class="price" v-else>
                    NT${{ useNumberThousands(spec.ItemNowPrice) }} x
                    {{ spec.buyQty }}
                  </div>

                  <div
                    class="delete"
                    @click.prevent="
                      buyQtyHandlerStore.changeMainBuyQty(item, specIndex, 0)
                    "
                  >
                    <i class="fas fa-trash-alt"></i>
                  </div>
                </div>
              </nuxt-link>
            </li>
          </template>
        </template>

        <!-- 沒有規格 -->
        <template v-if="!item.specArr">
          <li>
            <nuxt-link :to="`/product/${item.ID}`">
              <div class="img_and_name">
                <div
                  class="img"
                  :style="{ backgroundImage: `url(${item.Img1})` }"
                ></div>
                <div class="name">{{ item.Name }}</div>
              </div>
              <div class="price_and_delete">
                <div class="price">
                  NT${{ useNumberThousands(item.NowPrice) }} x {{ item.buyQty }}
                </div>
                <div
                  class="delete"
                  @click.prevent="
                    buyQtyHandlerStore.changeMainBuyQty(item, null, 0)
                  "
                >
                  <i class="fas fa-trash-alt"></i>
                </div>
              </div>
            </nuxt-link>
          </li>
        </template>

        <!-- 加價購 -->
        <template v-if="item.addProducts">
          <template v-for="(item2, index2) in item.addProducts">
            <!-- 有規格 -->
            <template v-if="item2.specArr">
              <template
                v-for="(spec2, specIndex2) in item2.specArr"
                :key="spec2.ID"
              >
                <li v-if="spec2.buyQty != 0 || spec2.buyQty === ''">
                  <nuxt-link :to="`/product/${item.ID}`">
                    <div class="img_and_name">
                      <div
                        class="img"
                        :style="{ backgroundImage: `url(${item2.Img})` }"
                      ></div>
                      <div class="name">
                        加價購 {{ item2.Name }}({{ spec2.Name }})
                      </div>
                    </div>
                    <div class="price_and_delete">
                      <!-- 多價格 carts_container 加價購 小計 -->
                      <div class="price" v-if="item2.priceType === 'onePrice'">
                        NT${{ useNumberThousands(item2.Price) }} x
                        {{ spec2.buyQty }}
                      </div>
                      <div class="price" v-else>
                        NT${{ useNumberThousands(spec2.ItemNowPrice) }} x
                        {{ spec2.buyQty }}
                      </div>
                    </div>
                  </nuxt-link>
                </li>
              </template>
            </template>
            <!-- 沒有規格 -->
            <template v-if="!item2.specArr">
              <li v-if="item2.buyQty != 0 || item2.buyQty === ''">
                <nuxt-link :to="`/product/${item2.ID}`">
                  <div class="img_and_name">
                    <div
                      class="img"
                      :style="{ backgroundImage: `url(${item2.Img})` }"
                    ></div>
                    <div class="name">加價購 {{ item2.Name }}</div>
                  </div>
                  <div class="price_and_delete">
                    <div class="price">
                      NT${{ useNumberThousands(item2.Price) }} x
                      {{ item2.buyQty }}
                    </div>
                  </div>
                </nuxt-link>
              </li>
            </template>
          </template>
        </template>
      </template>
    </ul>
    <div class="pushTo_cart">
      <nuxt-link to="/cart">
        <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        前往購物車
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/components/cart_and_favorite_container.scss";
</style>
