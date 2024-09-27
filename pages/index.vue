<script setup>
import { Swiper, SwiperSlide } from "swiper/vue"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

import ProductItem from "@/components/productItem.vue"

import { useUrlPush } from "@/composables/urlPush"

const config = useRuntimeConfig()

const modules = reactive([Autoplay, Pagination])

const commonStore = useCommonStore()
const productStore = useProductStore()

const homePage = ref({})

// originData: homePage.value.Ex or homePage.value.Category
function direct_link_handler(originData) {
  let arr = []

  let websubcategory = commonStore.all.websubcategory

  originData.forEach((item) => {
    if (!item.direct_link) {
      websubcategory.forEach((subCategory) => {
        if (subCategory.ID == item.Link) {
          if (subCategory.Class == 3) {
            item.direct_link = `/rich?id=${subCategory.CategoryID}&cid=1`
          } else if (subCategory.Class == 2) {
            item.direct_link = `/rich?id=${item.Link}&cid=0`
          } else if (subCategory.Class == 1) {
            item.direct_link = `/category?id=${item.Link}`
          } else if (subCategory.Class == 0) {
            item.direct_link = `/allProducts?id=${item.Link}`
          }
        }
      })
    }

    arr.push(item)
  })

  return arr
}

async function getHomePage() {
  /* commonStore.webData.GetHomePage
    Advertise, Category, data
  */
  if (!commonStore.webData.GetHomePage) return

  let webDataHomePage = JSON.parse(
    JSON.stringify(commonStore.webData.GetHomePage)
  )

  // 輪播
  let Ads = webDataHomePage.Advertise.filter((ad) => ad.URL)

  let originData = webDataHomePage.data[0]

  // Ex[i].Link: data.Type1 > 0 ? data.Type1 : data.OutUrl1
  let sortedData = {
    TopImg: originData.TopImg,
    PhoneImg: originData.PhoneImg,

    // 輪播
    Ads,

    // 兩格
    Ex: direct_link_handler(
      [
        {
          Img: originData.ExImg1,
          Link: originData.Type1,
          direct_link: originData.Type1 == 0 ? originData.OutUrl1 : ""
        },
        {
          Img: originData.ExImg2,
          Link: originData.Type2,
          direct_link: originData.Type2 == 0 ? originData.OutUrl2 : ""
        }
      ].filter((item) => item.Img)
    ),

    // 六格
    Category: direct_link_handler(
      [
        { Img: originData.Img1, Link: originData.Link1 },
        { Img: originData.Img2, Link: originData.Link2 },
        { Img: originData.Img3, Link: originData.Link3 },
        { Img: originData.Img4, Link: originData.Link4 },
        { Img: originData.Img5, Link: originData.Link5 },
        { Img: originData.Img6, Link: originData.Link6 }
      ].filter((item) => item.Img)
    ),

    // 社群
    Community: {
      FB: { Img: originData.FBImg, Link: originData.FBLink },
      Line: { Img: originData.LineImg, Link: originData.LineLink },
      IG: { Img: originData.IGImg, Link: originData.IGLink }
    }
  }

  if (process.env.NODE_ENV === "development") {
    sortedData.TopImg = config.public.apiUrl + sortedData.TopImg
    sortedData.PhoneImg = config.public.apiUrl + sortedData.PhoneImg

    sortedData.Ads.forEach((item) => {
      item.URL = config.public.apiUrl + item.URL
    })

    sortedData.Ex.forEach((item) => {
      item.Img = config.public.apiUrl + item.Img
    })

    sortedData.Category.forEach((item) => {
      item.Img = config.public.apiUrl + item.Img
    })
    if (sortedData.Community.FB.Img) {
      sortedData.Community.FB.Img =
        config.public.apiUrl + sortedData.Community.FB.Img
    }
    if (sortedData.Community.Line.Img) {
      sortedData.Community.Line.Img =
        config.public.apiUrl + sortedData.Community.Line.Img
    }
    if (sortedData.Community.IG.Img) {
      sortedData.Community.IG.Img =
        config.public.apiUrl + sortedData.Community.IG.Img
    }
  }

  homePage.value = sortedData
}

watch(
  () => commonStore.is_initial,
  (value) => {
    if (value && Object.entries(homePage.value).length < 1) getHomePage()
  },
  { immediate: true }
)
</script>

<template>
  <div class="main">
    <div class="banner" v-if="homePage.Ads && homePage.Ads.length">
      <swiper
        class="mySwiper"
        :loop="true"
        :autoplay="{
          delay: 5000,
          disableOnInteraction: false
        }"
        :pagination="{
          clickable: true
        }"
        :modules="modules"
      >
        <swiper-slide
          v-for="item in homePage.Ads"
          :key="item.ID"
          :style="{ backgroundImage: `url(${item.URL})` }"
        >
        </swiper-slide>
      </swiper>
    </div>

    <!-- 兩格 -->
    <div
      class="category_container"
      v-if="homePage.Ex && commonStore.all.websubcategory"
    >
      <ul>
        <li
          v-for="(item, index) in homePage.Ex"
          :key="index"
          :style="{ backgroundImage: `url(${item.Img})` }"
          @click="
            item.direct_link
              ? item.Link == 0
                ? useUrlPush(item.direct_link, true)
                : useUrlPush(item.direct_link)
              : ''
          "
        ></li>
      </ul>
    </div>

    <!-- 六格 -->
    <div
      class="sub_category_container"
      v-if="homePage.Category && commonStore.all.websubcategory"
    >
      <ul>
        <li
          v-for="(item, index) in homePage.Category"
          :key="index"
          :style="{ backgroundImage: `url(${item.Img})` }"
          @click="item.direct_link ? useUrlPush(item.direct_link) : ''"
        ></li>
      </ul>
    </div>

    <!-- products -->
    <div class="products">
      <div class="productList">
        <ul>
          <li v-for="item in productStore.products" :key="item.ID">
            <ProductItem :product="item" />
          </li>
        </ul>
      </div>
    </div>

    <!-- community-->
    <div class="community_category_container" v-if="homePage.Community">
      <ul>
        <li
          @click="useUrlPush(homePage.Community.FB.Link, 1)"
          v-if="homePage.Community.FB.Img"
        >
          <div
            class="pic"
            :style="{ backgroundImage: `url(${homePage.Community.FB.Img})` }"
          ></div>
        </li>
        <li
          @click="useUrlPush(homePage.Community.Line.Link, 1)"
          v-if="homePage.Community.Line.Img"
        >
          <div
            class="pic"
            :style="{ backgroundImage: `url(${homePage.Community.Line.Img})` }"
          ></div>
        </li>
        <li
          @click="useUrlPush(homePage.Community.IG.Link, 1)"
          v-if="homePage.Community.IG.Img"
        >
          <div
            class="pic"
            :style="{ backgroundImage: `url(${homePage.Community.IG.Img})` }"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/styles/pages/index.scss";
</style>
