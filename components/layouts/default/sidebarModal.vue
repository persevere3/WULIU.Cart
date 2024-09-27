<template>
  <div
    class="sidebar_container"
    :class="{ active: defaultLayoutStore.is_sidebar }"
    @click="defaultLayoutStore.close_sidebar"
  >
    <div
      class="sidebar"
      :class="{ sidebar_slideout: defaultLayoutStore.is_slideout }"
      @click.stop=""
    >
      <div class="navbar">
        <ul>
          <li @click="useUrlPush('/')">
            <div class="text">首頁</div>
          </li>

          <li @click="useUrlPush('/products')">
            <div class="text">商品列表</div>
          </li>

          <li @click="useUrlPush('/cart')">
            <div class="text">購物車列表</div>
          </li>

          <li
            v-for="item in commonStore.all.Navbar"
            :key="item.ID"
            @click="
              item.Class == 2
                ? useUrlPush(item.Link, true)
                : useUrlPush(item.Link)
            "
          >
            <div class="text">
              {{ item.Name }}
              <div
                class="angle"
                @click.stop="item.isDropDown = !item.isDropDown"
              >
                <i
                  class="fa fa-angle-down"
                  :class="{ i_active: item.isDropDown }"
                  aria-hidden="true"
                  v-if="item.subNavbar"
                >
                </i>
              </div>
            </div>
            <template v-if="item.subNavbar">
              <ul :class="{ ul_active: item.isDropDown }">
                <li
                  v-for="item2 in item.subNavbar"
                  :key="item2.ID"
                  @click.stop="useUrlPush(item2.Link)"
                >
                  {{ item2.Name }}
                </li>
              </ul>
            </template>
          </li>
        </ul>
      </div>
      <div class="other">
        <div class="text">其他</div>
        <ul>
          <li
            @click="
              ;(defaultLayoutStore.is_search = true),
                (defaultLayoutStore.is_sidebar = false)
            "
          >
            搜尋
            <i class="fa fa-search" aria-hidden="true"></i>
          </li>
          <li
            @click.stop="
              productStore.is_favorite_modal = !productStore.is_favorite_modal
            "
          >
            我的最愛
            <i class="fas fa-heart"></i>
          </li>
          <li
            @click.stop="
              cartStore.cart.length &&
                (cartStore.is_cart_modal = !cartStore.is_cart_modal)
            "
          >
            購物車
            <i class="fa fa-shopping-cart" aria-hidden="true"></i>
          </li>
          <li @click="useUrlPush('/order')">
            訂單查詢
            <i class="fas fa-clipboard-list"></i>
          </li>
          <li
            v-if="commonStore.site.MemberFuction * 1"
            @click="
              commonStore.user_account
                ? useUrlPush('/info')
                : useUrlPush('/user')
            "
          >
            會員登入
            <i class="fas fa-user"></i>
          </li>
          <li @click="defaultLayoutStore.open_connect">
            聯絡我們
            <i class="fa fa-comment" aria-hidden="true"></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const defaultLayoutStore = useDefaultLayoutStore()
const commonStore = useCommonStore()
const productStore = useProductStore()
const cartStore = useCartStore()
</script>
