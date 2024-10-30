<script setup>
import ProductBuyQtyBox from "@/components/ProductBuyQtyBox.vue"
import Cart from "~/components/pages/cart/index.vue"

import { Swiper, SwiperSlide } from "swiper/vue"
import "swiper/css"

import { useNumberThousands } from "@/composables/numberThousands"
import { useUnescapeHTML } from "@/composables/unescapeHTML"
import { useCopy } from "@/composables/copy"

const commonStore = useCommonStore()
const productStore = useProductStore()
const cartStore = useCartStore()

const props = defineProps({
  product: {
    type: Object
  }
})

const mainRef = ref(null)
const addProductsRef = ref(null)

const isShow = ref(false)
const isShowAddProduct = ref(true)
const isShowDetail = ref(true)

let useSwiper = ref({})
function onSwiper(swiper) {
  useSwiper.value = swiper
}

function click_share_link() {
  useCopy(location.href, ".copy_input")

  commonStore.showMessage("複製分享連結", true)
}

productStore.getAddProducts([props.product.ID])
</script>

<template>
  <div class="p_product">
    <div class="picContent">
      <div class="pic">
        <div
          class="mainPic"
          :style="{
            backgroundImage: `url(${product.imgArr[product.mainImgIndex]})`
          }"
        ></div>
        <div class="allPic">
          <swiper :slides-per-view="3" @swiper="onSwiper">
            <swiper-slide
              v-for="(item, index) in product.imgArr"
              :key="`${item}_${index}`"
              :class="{ active: product.mainImgIndex === index }"
            >
              <div class="border"></div>
              <img :src="item" @click="product.mainImgIndex = index" alt="" />
            </swiper-slide>
          </swiper>
          <div class="controler" v-show="product.imgArr.length > 3">
            <div class="prev" @click="useSwiper.slidePrev()">
              <i class="fa-solid fa-caret-left"></i>
            </div>
            <div class="next" @click="useSwiper.slideNext()">
              <i class="fa-solid fa-caret-right"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="name">{{ product.Name }}</div>

        <!-- 多價格 product 主商品 info -->
        <template v-if="product.priceType === 'onePrice'">
          <div class="price">
            NT$ {{ useNumberThousands(product.NowPrice) }}
          </div>
          <div class="price origin" v-if="parseInt(product.Price) > -1">
            NT$ {{ useNumberThousands(product.Price) }}
          </div>
        </template>
        <template v-else>
          <template
            v-if="mainRef && mainRef.selectedSpec && mainRef.selectedSpec.ID"
          >
            <div class="price">
              NT$
              {{ useNumberThousands(mainRef.selectedSpec.ItemNowPrice) }}
            </div>
            <div
              class="price origin"
              v-if="parseInt(mainRef.selectedSpec.ItemPrice) > -1"
            >
              NT$
              {{ useNumberThousands(mainRef.selectedSpec.ItemPrice) }}
            </div>
          </template>
          <template v-else>
            <div class="price">NT$ {{ product.nowPriceRange }}</div>
            <div class="price origin" v-if="product.priceRange">
              NT$ {{ product.priceRange }}
            </div>
          </template>
        </template>

        <div class="name">
          <div v-html="useUnescapeHTML(product.Content)"></div>
        </div>

        <ProductBuyQtyBox ref="mainRef" :main="product" />

        <div class="controller">
          <div
            class="addTo_favorite_btn"
            v-if="!productStore.isSingleProduct"
            @click.stop="productStore.toggleFavorite(product.ID)"
          >
            加入我的最愛
            <i
              class="fas fa-heart"
              :class="{ is_favorite: productStore.favorite[product.ID] }"
            ></i>
          </div>

          <div class="share_link_btn" @click="click_share_link">
            分享 <i class="fas fa-share"></i>
          </div>
          <input type="text" class="copy_input hide" readonly />
        </div>
      </div>
    </div>

    <div
      class="addProduct"
      v-if="product.addProducts && product.addProducts.length"
    >
      <div class="title">
        加價購
        <i
          v-if="isShowAddProduct"
          class="fa-solid fa-caret-up"
          @click="isShowAddProduct = false"
        ></i>
        <i
          v-else
          class="fa-solid fa-caret-down"
          @click="isShowAddProduct = true"
        ></i>
      </div>
      <ul v-show="isShowAddProduct">
        <div class="ulMask" v-if="!cartStore.getMainTotalQty(product)"></div>
        <li v-for="(item, index) in product.addProducts" :key="item.ID">
          <div class="pic_div">
            <div
              class="pic"
              :style="{ backgroundImage: `url(${item.Img})` }"
            ></div>
          </div>
          <div class="content">
            <div class="name">{{ item.Name }}</div>

            <!-- 多價格 product 加價購 info -->
            <template v-if="item.priceType === 'onePrice'">
              <div class="price">NT$ {{ useNumberThousands(item.Price) }}</div>
            </template>
            <template v-else>
              <template
                v-if="addProductsRef[index] && addProductsRef[index].ID"
              >
                <div class="price">
                  NT$
                  {{ useNumberThousands(addProductsRef[index].ItemNowPrice) }}
                </div>
              </template>
              <template v-else>
                <div class="price">NT$ {{ item.nowPriceRange }}</div>
              </template>
            </template>

            <ProductBuyQtyBox
              ref="addProductsRef"
              :main="product"
              :addProduct="item"
            />
          </div>
        </li>
      </ul>
    </div>

    <div class="detail">
      <div class="title">
        商品詳情
        <i
          v-if="isShowDetail"
          class="fa-solid fa-caret-up"
          @click="isShowDetail = false"
        ></i>
        <i
          v-else
          class="fa-solid fa-caret-down"
          @click="isShowDetail = true"
        ></i>
      </div>
      <div
        v-show="isShowDetail"
        class="content ql-editor"
        v-html="useUnescapeHTML(product.Detail)"
      ></div>
    </div>

    <div
      class="buyNow"
      v-if="productStore.isSingleProduct && cartStore.getMainTotalQty(product)"
    >
      <div class="title">立即購買</div>

      <Cart v-if="cartStore.cart.length" />
    </div>
  </div>
</template>

<style lang="scss">
@import "@/styles/_quill.scss";

.p_product {
  width: 960px;
  margin: 0 auto;
  padding: 25px;

  @include mw992 {
    width: 95%;
  }
  @include mw767 {
    width: 90%;
  }

  .picContent {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-around;

    .pic {
      width: 40%;
      position: relative;

      .mainPic {
        background-size: cover;
        background-position: center;
        padding-bottom: 100%;
        margin-bottom: 10px;
      }
      .allPic {
        position: relative;

        .swiper-slide {
          padding-bottom: 33.33333%;
          position: relative;

          &.active {
            .border {
              width: 98%;
              height: 98%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);

              border: 1px solid $primaryColor;
            }
          }

          img {
            width: 93%;
            height: 93%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            cursor: pointer;
            z-index: 1;
          }
        }

        .controler {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          color: $secondColor;
          font-size: 32px;

          .prev,
          .next {
            position: absolute;
            top: 50%;
            cursor: pointer;

            &:hover {
              color: $primaryColor;
            }
          }
          .prev {
            left: 0;
            transform: translate(-100%, -50%);
          }
          .next {
            right: 0;
            transform: translate(100%, -50%);
          }
        }
      }
    }

    .content {
      width: 40%;

      .name {
        margin-bottom: 15px;
        font-size: 18px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .price {
        margin-bottom: 5px;
        font-size: 18px;

        &.origin {
          margin-bottom: 15px;
          font-size: 14px;
          color: $secondColor_a;
          text-decoration: line-through;
        }
      }

      .controller {
        display: flex;
      }

      .goTo_cart_btn,
      .addTo_favorite_btn,
      .share_link_btn {
        width: 100%;
        height: 35px;
        margin-bottom: 5px;
        border-radius: 5px;
        background-color: $secondColor;
        color: $white;

        display: flex;
        justify-content: center;
        align-items: center;

        cursor: pointer;

        i {
          margin-left: 5px;
          color: $white;

          &.is_favorite {
            color: $dangerColor;
          }
        }

        &:hover {
          background-color: $secondColor_3;
        }
      }
      .copy_input.hide {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        opacity: 0;
      }

      .addTo_favorite_btn {
        margin-right: 5px;
      }
    }
  }

  .addProduct,
  .detail,
  .buyNow {
    > .title {
      height: 30px;
      line-height: 30px;
      margin-bottom: 10px;
      border-bottom: 1px solid $secondColor_a;
      position: relative;

      i {
        width: 30px;
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
    }
  }

  .addProduct {
    > ul {
      width: 100%;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .ulMask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: $white;
        opacity: 0.5;
        z-index: 5;
      }

      > li {
        width: 49.5%;
        padding: 5px 0px;
        margin-bottom: 1%;
        border-radius: 5px;
        border: 1px solid $secondColor_a;
        display: flex;
        justify-content: space-around;
        align-items: center;

        .pic_div {
          width: 40%;

          .pic {
            padding-bottom: 100%;
            background-size: cover;
            background-position: center;
          }
        }
        .content {
          width: 40%;
          > .name {
            height: 40px;
            line-height: 20px;
            margin-bottom: 10px;

            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price {
            margin-bottom: 5px;
            font-size: 18px;
          }
        }
      }
    }
  }

  .detail {
    .content {
      padding: 10px;
      word-wrap: break-all;

      img {
        max-width: 100%;
        vertical-align: bottom;
      }
    }
  }

  .cartContent {
    width: 100%;
  }
}
</style>
