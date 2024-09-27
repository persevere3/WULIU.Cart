<script setup>
import Product from "~/components/pages/product/index.vue"

const productStore = useProductStore()

const productId = useRoute().params.id
const product = ref({})

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
