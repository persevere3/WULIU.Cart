<script setup>
import Product from "~/components/pages/product/index.vue"

const commonStore = useCommonStore()
const productStore = useProductStore()

// 透過 useRoute().params.id 找出商品id productId
const productId = useRoute().params.id
const product = ref({})

// 透過 商品id productId 從商品列表中找出商品 product
watch(
  () => productStore.products,
  (v) => {
    if (v.length > 0) {
      let selectProduct = v.find((product) => product.ID === productId)
      if (selectProduct) product.value = selectProduct
    }
  },
  { immediate: true }
)
</script>

<template>
  <Product v-if="product.ID" :product="product" />
</template>
