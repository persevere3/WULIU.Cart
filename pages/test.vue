<template>
  <div class="productContainer" @click.stop="isShowFavorite = false">
    <SelectedProduct v-if="selectedProduct.ID" />
    <Cart v-if="showPage === 'cart'" />
    <!-- 訂購須知 配送須知 隱私權聲明 -->
    <Notice
      v-if="
        showPage === 'Content' ||
        showPage === 'Description' ||
        showPage === 'PrivacyPolicy'
      "
    />

    <CartIcon v-if="showPage === 'main' && !selectedProduct.ID" />
    <FavoriteIcon
      v-if="
        showPage === 'main' &&
        !selectedProduct.ID &&
        Object.keys(favorite).length
      "
    />

    <Confirm />
    <Message />
  </div>
</template>

<script setup>
// components ========== ========== ========== ========== ==========
import SelectedProduct from "@/components/cart/SelectedProduct.vue"
import Cart from "@/components/cart/cart/Cart.vue"

import Notice from "@/components/cart/Notice.vue"

import Confirm from "@/components/cart/Confirm.vue"
import Message from "@/components/cart/Message.vue"

// watch ========== ========== ========== ========== ==========
watch(showPage, (newV, oldV) => {
  if (newV == "cart") stepPage.value = 1

  if (
    newV === "Content" ||
    newV === "Description" ||
    newV === "PrivacyPolicy"
  ) {
    setTimeout(() => {
      computeVideoSize(newV)
    }, 0)
  }
})

watch(selectedProduct, (newV, oldV) => {
  if (newV.ID) {
    if (!isSingleProduct.value)
      window.history.replaceState({}, "", `${location.pathname}?id=${newV.ID}`)
    else
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?spid=${newV.ID}`
      )
    setTimeout(() => {
      let event = new Event("resize")
      window.dispatchEvent(event)
    }, 100)
  } else window.history.replaceState({}, "", `${location.pathname}`)
})

watch(user_account, (newV, oldV) => {
  console.log("watch: user_account", newV, oldV)
  localStorage.setItem("user_account", newV)

  if (!newV) {
    info.value.purchaser_email.value = ""
    info.value.purchaser_name.value = ""
    info.value.purchaser_number.value = ""
    info.value.receiver_name.value = ""
    info.value.receiver_number.value = ""

    memberInfo.value = {}
  }
})

watch(
  memberInfo,
  (newV, oldV) => {
    if (!newV.Phone && !newV.Email) {
      user_account.value = ""
    }
    total_bonus.value = newV.Wallet * 1
  },
  { deep: true }
)

// methods ========== ========== ========== ========== ==========
function computeVideoSize() {
  let content = document.querySelector(".content.ql-editor")
  if (!content) return
  let contentWidth = content.offsetWidth
  if (showPage.value == "main") contentWidth -= 20
  let videos = content.querySelectorAll("iframe")
  videos.forEach((video) => {
    if (video.width > contentWidth) {
      video.style.width = `${contentWidth}px`
      video.style.height = `${video.height / (video.width / contentWidth)}px`
    }
  })
}
</script>
