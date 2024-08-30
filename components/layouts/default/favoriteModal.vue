<script setup>
import { useNumberThousands } from "@/composables/numberThousands"
const productStore = useProductStore()

const modal = ref(null)

//
function closeModal() {
  productStore.is_favorite_modal = false
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
    class="favorite_container"
    :class="{ active: productStore.is_favorite_modal }"
    v-if="Object.keys(productStore.favorite).length"
  >
    <ul class="items">
      <template v-for="item in productStore.favorite">
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
              <!-- 多價格 favorite_container 主商品 單價 -->
              <div class="price" v-if="item.priceType === 'onePrice'">
                NT${{ useNumberThousands(item.NowPrice) }}
              </div>
              <div class="price" v-else>NT${{ item.nowPriceRange }}</div>

              <div
                class="delete"
                @click.prevent="productStore.toggleFavorite(item.ID)"
              >
                <i class="fas fa-trash-alt"></i>
              </div>
            </div>
          </nuxt-link>
        </li>
      </template>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/components/cart_and_favorite_container";
</style>
