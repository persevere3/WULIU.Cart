<script setup>
import { getCategoryApi } from "@/apis/pages"

import ProductItem from "@/components/productItem.vue"

import { useUnescapeHTML } from "@/composables/unescapeHTML"
import { useRequest } from "@/composables/request"

let { return_formData } = useRequest()

const config = useRuntimeConfig()
const commonStore = useCommonStore()
const productStore = useProductStore()

const { is_initial } = storeToRefs(commonStore)
const { category_products } = storeToRefs(productStore)

const category_content = ref({})
const show_categories = ref([])

async function ajaxCategory() {
  let query = {
    WebPreview: commonStore.site.WebPreview || 1,
    id: useRoute().query.id
  }

  let formData = return_formData(query)

  try {
    const res = JSON.parse(await getCategoryApi(formData))
    const isResSuccess = commonStore.resHandler(res)
    if (!isResSuccess) return ajaxCategory()

    return res
  } catch (error) {
    console.log(error)
  }
}

function initCategory(resData) {
  console.log("initCategory")

  category_content.value = resData.Data[0]
  category_content.value.Img = [
    category_content.value.Img1,
    category_content.value.Img2,
    category_content.value.Img3,
    category_content.value.Img4,
    category_content.value.Img5
  ].filter((i) => i)

  if (process.env.NODE_ENV === "development") {
    category_content.value.Img.forEach((item, index) => {
      category_content.value.Img[index] = config.public.apiUrl + item
    })
  }

  show_categories.value = resData.Category.map((c) => c.ID)
}

function videoHandler(url) {
  let code = ""
  if (url.indexOf("youtu.be") != -1) {
    code = url.split("https://youtu.be/")[1]
  } else if (url.indexOf("www.youtube.com") != -1) {
    if (url.split("?v=").length > 1) {
      code = url.split("?v=")[1].split("&")[0]
    }
  }
  let iframe = ""
  if (code) {
    iframe = `
        <iframe src="https://www.youtube.com/embed/${code}"
          frameborder="0"
          allow="accelerometer;
            autoplay; clipboard-write;
            encrypted-media;
            gyroscope;
            picture-in-picture"
          allowfullscreen
        >
        </iframe>
      `
  }
  return iframe
}

onMounted(async () => {
  let data = await ajaxCategory()
  initCategory(data)
})

const fullPath = computed(() => useRoute().fullPath)
watch(fullPath, async () => {
  let data = await ajaxCategory()
  initCategory(data)
})
</script>

<template>
  <div
    class="allProductsAndCategory"
    v-if="Object.entries(category_content).length > 0"
  >
    <template v-if="category_content.Img.length > 0">
      <div
        class="img_container"
        v-for="(item, index) in category_content.Img"
        :key="index"
        :style="{ backgroundImage: `url(${item})` }"
      ></div>
    </template>
    <div class="content">
      <div class="rich_container" v-if="category_content.Text">
        <div
          class="ql-editor"
          v-html="useUnescapeHTML(category_content.Text)"
        ></div>
      </div>

      <div
        class="video_container"
        v-if="category_content.Video"
        v-html="videoHandler(category_content.Video)"
      ></div>
    </div>

    <template v-if="category_products">
      <div
        class="products"
        v-for="(item, key) in category_products"
        :key="`Sort${key}`"
        v-show="show_categories.indexOf(item.ID) > -1"
      >
        <div class="title">
          {{ item.Name }}
        </div>
        <div class="productList">
          <ul>
            <li v-for="(item2, key2) in item.products" :key="`products${key2}`">
              <ProductItem :product="item2" />
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import "@/styles/components/allProductsAndCategory.scss";
@import "@/styles/_quill.scss";
</style>
