<template>
  <header
    class="header"
    :class="{
      index: useRoute().name === 'index',
      other: useRoute().name !== 'index',
      is_scrollTop: defaultLayoutStore.window_scrollTop > 100
    }"
  >
    <div class="widthContainer">
      <div class="logo" v-if="commonStore.store" @click="useUrlPush('/')">
        <img :src="commonStore.store.Logo" alt="" />
      </div>
      <div class="iconbar">
        <ul>
          <li class="search_button">
            <input
              type="text"
              maxlength="100"
              placeholder="找商品"
              v-model="defaultLayoutStore.searchStr"
              @keyup.enter="defaultLayoutStore.searchHandler"
            />
            <i
              class="fa fa-search"
              aria-hidden="true"
              @click="defaultLayoutStore.searchHandler"
            ></i>
          </li>
          <li class="m_search_button">
            <i
              class="fa fa-search"
              aria-hidden="true"
              @click="defaultLayoutStore.is_search = true"
            ></i>
            <div class="tip">搜尋商品</div>
          </li>

          <li class="connect_button" @click="defaultLayoutStore.open_connect">
            <i class="fa fa-comment" aria-hidden="true"></i>
            <div class="tip">聯絡我們</div>
          </li>
          <li
            @click.stop="
              productStore.is_favorite_modal = !productStore.is_favorite_modal
            "
          >
            <i class="fas fa-heart"></i>
            <div class="tip">我的最愛</div>
          </li>
          <li @click.stop="cartStore.is_cart_modal = !cartStore.is_cart_modal">
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
            <div class="tip">購物車</div>
          </li>
          <li @click="useUrlPush('/order')">
            <i class="fas fa-clipboard-list"></i>
            <div class="tip">訂單查詢</div>
          </li>
          <li
            v-if="commonStore.site.MemberFuction * 1"
            @click="
              commonStore.user_account
                ? useUrlPush('/info')
                : useUrlPush('/user')
            "
          >
            <i class="fas fa-user"></i>
            <div class="tip">會員中心</div>
          </li>
        </ul>
        <div
          class="navbar_button"
          @click="defaultLayoutStore.open_sidebar"
          :class="{ is_background: defaultLayoutStore.window_scrollTop > 100 }"
        >
          <i class="fa fa-th-list" aria-hidden="true"></i>
          <div class="tip">側邊選單</div>
        </div>
      </div>

      <div class="navbar">
        <ul>
          <li>
            <nuxt-link to="/"> 首頁 </nuxt-link>
          </li>

          <li>
            <nuxt-link to="/products"> 商品列表 </nuxt-link>
          </li>
          <li>
            <nuxt-link to="/cart"> 購物車列表 </nuxt-link>
          </li>

          <li v-for="(item, key) in commonStore.all.Navbar" :key="key">
            <nuxt-link :to="`${item.Link ? item.Link : ''}`">
              {{ item.Name }}
              <template v-if="item.subNavbar">
                <i class="fa fa-angle-down" aria-hidden="true"></i>
                <div class="transparent"></div>
                <ul>
                  <li
                    v-for="(item2, key2) in item.subNavbar"
                    :key="key2"
                    @click.stop
                  >
                    <nuxt-link :to="`${item2.Link}`">
                      {{ item2.Name }}
                    </nuxt-link>
                  </li>
                </ul>
              </template>
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUrlPush } from "@/composables/urlPush"

const commonStore = useCommonStore()
const defaultLayoutStore = useDefaultLayoutStore()
const productStore = useProductStore()
const cartStore = useCartStore()

function resizeHandler() {
  document.querySelector("body").style["padding-top"] =
    document.querySelector(".header").getBoundingClientRect().height + "px"
}

onMounted(() => {
  resizeHandler()
  window.addEventListener("resize", resizeHandler)
})

const fullPath = computed(() => useRoute().fullPath)
watch(fullPath, async () => {
  await nextTick()
  resizeHandler()
})
</script>
