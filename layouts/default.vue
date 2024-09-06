<template>
  <SidebarModal />

  <SearchModal />
  <ConnectModal />

  <CartModal />
  <FavoriteModal />

  <!-- content start -->
  <Header />
  <slot :key="commonStore.componentKey" />
  <Footer />
  <!-- content end -->

  <ToTopIcon />

  <Third />

  <Message />
  <Confirm />
</template>

<script setup>
import SidebarModal from "@/components/layouts/default/sidebarModal.vue"
import SearchModal from "@/components/layouts/default/searchModal.vue"
import ConnectModal from "@/components/layouts/default/connectModal.vue"
import CartModal from "@/components/layouts/default/cartModal.vue"
import FavoriteModal from "@/components/layouts/default/favoriteModal.vue"

import Header from "@/components/layouts/default/header"
import Footer from "@/components/layouts/default/footer"

import ToTopIcon from "@/components/layouts/default/toTopIcon.vue"
import Third from "@/components/layouts/default/third"

import Message from "@/components/layouts/default/Message.vue"
import Confirm from "@/components/layouts/default/Confirm.vue"

const commonStore = useCommonStore()

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

commonStore.initialWeb()
</script>

<style lang="scss">
@import "@/styles/layout/default.scss";
</style>
