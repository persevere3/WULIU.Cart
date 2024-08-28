<script setup>
import { useNumberThousands } from "@/composables/numberThousands"
import { useUnescapeHTML } from "@/composables/unescapeHTML"

const config = useRuntimeConfig()

const commonStore = useCommonStore()
const productStore = useProductStore()

const { id } = useRoute().query

const category_product = ref({})

async function getCategory() {
  category_product.value = commonStore.webData.GetWebSubCategory

  category_product.value.Sort = {}
  let sort = category_product.value.Sort

  // origin data
  let data = category_product.value.Data[0]
  let category = category_product.value.Category
  let product = category_product.value.Product

  productStore.multiPriceHandler(product)

  // category => sort[i]
  for (let i = 0; i < category.length; i++) {
    sort[category[i].ID] = {}
    sort[category[i].ID].Products = {}
    sort[category[i].ID].Name = category[i].Name
  }

  // product => sort[i].Products[j]
  for (let i = 0; i < product.length; i++) {
    if (process.env.NODE_ENV === "development")
      product[i].Img1 = config.public.apiUrl + product[i].Img1

    // Category1~5
    for (let j = 1; j < 6; j++) {
      let category_item = product[i][`Category${j}`]
      if (category_item) {
        if (sort[category_item]) {
          sort[category_item].Products[product[i].ID] = product[i]
        }
      }
    }
  }

  data.Img = []
  for (let i = 1; i < 6; i++) {
    if (data[`Img${i}`]) {
      if (process.env.NODE_ENV === "development")
        data[`Img${i}`] = config.public.apiUrl + data[`Img${i}`]

      data.Img.push(data[`Img${i}`])
    }
  }
}

// allProducts, category
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

const { is_initial } = storeToRefs(commonStore)
watch(is_initial, async (value) => {
  if (value) {
    await getCategory()
    await nextTick()
    commonStore.imgHandler()
  }
})
</script>

<template>
  <div class="allProductsAndCategory">
    <template
      v-if="
        category_product &&
        category_product.Data &&
        category_product.Data[0].Img &&
        category_product.Data[0].Img.length
      "
    >
      <div
        class="img_container"
        v-for="(item, index) in category_product.Data[0].Img"
        :key="index"
        :style="{ backgroundImage: `url(${item})` }"
      ></div>
    </template>
    <div class="content">
      <div
        class="rich_container"
        v-if="
          category_product &&
          category_product.Data &&
          category_product.Data[0].Text
        "
      >
        <div
          class="ql-editor"
          v-html="useUnescapeHTML(category_product.Data[0].Text)"
        ></div>
      </div>

      <div
        class="video_container"
        v-if="
          category_product &&
          category_product.Data &&
          category_product.Data[0].Video
        "
        v-html="videoHandler(category_product.Data[0].Video)"
      ></div>
    </div>

    <template v-if="category_product">
      <div
        class="products"
        v-for="(item, key) in category_product.Sort"
        :key="`Sort${key}`"
        v-show="Object.keys(item.Products).length"
      >
        <div class="title">
          {{ item.Name }}
        </div>
        <div class="product_list">
          <ul>
            <li
              v-for="(item2, key2) in item.Products"
              :key="`Products${key2}`"
              @click="commonStore.pushTo_cart(item2.ID)"
            >
              <div
                class="pic"
                :style="{ backgroundImage: `url(${item2.Img1})` }"
              >
                <div
                  class="addTo_favorite_btn"
                  @click.stop="productStore.toggleFavorite(item2.ID)"
                >
                  加入我的最愛
                  <i
                    class="fas fa-heart"
                    :class="{ is_favorite: productStore.favorite[item2.ID] }"
                  ></i>
                </div>
                <div class="addTo_cart_btn">加入購物車</div>
              </div>
              <div class="info">
                <div class="name">{{ item2.Name }}</div>

                <!-- 多價格 products 主商品 單價 -->
                <template v-if="item2.priceType === 'onePrice'">
                  <div class="discount_price">
                    NT${{ useNumberThousands(item2.NowPrice) }}
                  </div>
                  <div
                    class="origin_price"
                    :class="{ opacity0: parseInt(item2.Price) < 0 }"
                  >
                    NT${{ useNumberThousands(item2.Price) }}
                  </div>
                </template>
                <template v-else>
                  <div class="discount_price">NT${{ item2.nowPriceRange }}</div>
                  <div
                    class="origin_price"
                    :class="{ opacity0: !item2.priceRange }"
                  >
                    NT${{ item2.priceRange }}
                  </div>
                </template>
              </div>
              <div class="l_addTo_cart_btn">
                <i class="fa fa-shopping-cart" aria-hidden="true"></i>
              </div>
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
