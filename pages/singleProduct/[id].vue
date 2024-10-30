<script setup>
import Product from "~/components/pages/product/index.vue"
import Message from "@/components/layouts/default/Message.vue"
import Confirm from "@/components/layouts/default/Confirm.vue"

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      integrity:
        "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
      crossorigin: "anonymous"
    }
  ]
})

definePageMeta({
  layout: false
})

const commonStore = useCommonStore()
const productStore = useProductStore()

const productId = useRoute().params.id
const product = ref({})

if (useRoute().fullPath.indexOf("singleProduct") > -1)
  productStore.isSingleProduct = true

await commonStore.ajaxWeb()

if (process.env.NODE_ENV === "production") {
  if (useRoute().params.id || useRoute().params.id === 0) {
    let jsonLd = commonStore.webData.StoreLogin.ldjson.find(
      (item) => item.identifier === useRoute().params.id
    )

    useHead({
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd)
        }
      ]
    })
  }
}

setTimeout(() => {
  commonStore.webHandler()
}, 0)

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

  <Message />
  <Confirm />
</template>
