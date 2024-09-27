<script setup>
import { useNumberThousands } from "@/composables/numberThousands"

const productStore = useProductStore()

const props = defineProps({
  product: {
    type: Object
  }
})
</script>

<template>
  <div class="c_product">
    <nuxt-link :to="`/product/${product.ID}`">
      <div class="pic" :style="{ backgroundImage: `url(${product.Img1})` }">
        <div class="controller">
          <div
            class="addToFavoriteBtn"
            @click.prevent="productStore.toggleFavorite(product.ID)"
          >
            <i
              class="fas fa-heart"
              :class="{ is_favorite: productStore.favorite[product.ID] }"
            ></i>
          </div>

          <div class="addToCartBtn">
            加入購物車
            <i class="fa fa-shopping-cart"></i>
          </div>
        </div>
      </div>

      <div class="info">
        <div class="name">{{ product.Name }}</div>

        <!-- 多價格 products 主商品 單價 -->
        <template v-if="product.priceType === 'onePrice'">
          <div class="discount_price">
            NT${{ useNumberThousands(product.NowPrice) }}
          </div>
          <div class="origin_price" v-if="parseInt(product.Price) > -1">
            NT${{ useNumberThousands(product.Price) }}
          </div>
        </template>
        <template v-else>
          <template v-if="product.selectSpecItem && product.selectSpecItem.ID">
            <div class="discount_price">
              NT$ {{ useNumberThousands(product.selectSpecItem.ItemNowPrice) }}
            </div>
            <div class="origin_price">
              NT$ {{ useNumberThousands(product.selectSpecItem.ItemPrice) }}
            </div>
          </template>
          <template v-else>
            <div class="discount_price">NT$ {{ product.nowPriceRange }}</div>
            <div class="origin_price">NT$ {{ product.priceRange }}</div>
          </template>
        </template>
      </div>

      <div class="m_controller">
        <div
          class="m_addToFavoriteBtn"
          @click.stop="productStore.toggleFavorite(product.ID)"
        >
          <i
            class="fas fa-heart"
            :class="{ is_favorite: productStore.favorite[product.ID] }"
          ></i>
        </div>
        <div class="m_addToCartBtn">
          <i class="fa fa-shopping-cart" aria-hidden="true"></i>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<style lang="scss" scope>
@import "@/styles/mixin/_ellipsis.scss";

.c_product {
  a {
    display: block;
    text-decoration: none;

    padding: 0px 5px;
    cursor: pointer;

    .pic {
      width: 100%;
      aspect-ratio: 1 / 1;
      background-size: cover;
      background-position: center;
      position: relative;

      overflow: hidden;

      &:before {
        content: "";
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: $modalBackground;
        display: none;
      }

      .controller {
        position: absolute;
        left: 10px;
        right: 10px;
        bottom: 10px;

        display: none;

        .addToFavoriteBtn,
        .addToCartBtn {
          height: 40px;

          border-radius: 3px;
          background: #fff;
          color: #333;

          font-size: 14px;

          display: flex;
          justify-content: center;
          align-items: center;

          transition: 0.4s;

          &:hover {
            background: $primaryColor;
            color: #fff;
          }
        }

        .addToFavoriteBtn {
          width: 40px;
          margin-right: 5px;

          .is_favorite {
            color: $dangerColor;
          }
        }

        .addToCartBtn {
          flex-grow: 1;

          i {
            margin-left: 5px;
          }
        }
      }
    }

    .info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .name {
        width: 100%;
        margin-top: 10px;
        margin-bottom: 4px;
        text-align: center;
        line-height: 1.4;
        font-size: 14px;
        color: #333;
        @include single_ellipsis;
      }

      .discount_price {
        font-size: 16px;
        font-weight: bold;
        color: $primaryColor;
        @include single_ellipsis;
      }
      .origin_price {
        margin-bottom: 5px;
        text-decoration: line-through;
        font-size: 14px;
        color: #888;
        @include single_ellipsis;
      }
    }

    .m_controller {
      display: none;
      @include l {
        display: flex;
      }

      .m_addToFavoriteBtn,
      .m_addToCartBtn {
        flex: 1 1;

        height: 30px;
        margin-top: 5px;

        border-radius: 3px;
        background-color: #f7f7f7;
        color: $primaryColor;

        display: flex;
        justify-content: center;
        align-items: center;

        .is_favorite {
          color: $dangerColor;
        }
      }

      .m_addToFavoriteBtn {
        margin-right: 5px;
      }
    }

    &:hover {
      .pic {
        &:before {
          display: block;
        }

        .controller {
          display: flex;
        }
      }
    }
  }
}
</style>
