<script setup>
import Product from "~/components/pages/product/index.vue"

const productStore = useProductStore()

const route = useRoute()
const productId = route.params.id

const product = ref({})

watch(
  () => productStore.products,
  (v) => {
    if (v.length > 0) {
      let selectProduct = productStore.products.find(
        (selectProduct) => selectProduct.ID === productId
      )
      if (selectProduct) product.value = selectProduct
    }
  }
)
</script>

<template>
  <Product v-if="product.ID" :product="product" />
</template>
