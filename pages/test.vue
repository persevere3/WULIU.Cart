<template>
  <div class="productContainer" @click.stop="isShowFavorite = false">
    <!-- 訂購須知 配送須知 隱私權聲明 -->
    <Notice
      v-if="
        showPage === 'Content' ||
        showPage === 'Description' ||
        showPage === 'PrivacyPolicy'
      "
    />
  </div>
</template>

<script setup>
import Notice from "@/components/cart/Notice.vue"

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
