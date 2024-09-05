<template>
  <div class="notice_list">
    <ul>
      <li v-if="commonStore.store.Content" @click="activeNotice = 'Content'">
        訂購須知
      </li>
      <li
        v-if="commonStore.store.Description"
        @click="activeNotice = 'Description'"
      >
        配送須知
      </li>
      <li
        v-if="commonStore.store.PrivacyPolicy"
        @click="activeNotice = 'PrivacyPolicy'"
      >
        隱私權聲明
      </li>
    </ul>
  </div>

  <div class="notice_page" v-if="activeNotice" @click="activeNotice = ''">
    <div class="close">
      <i class="fa fa-times" aria-hidden="true"></i>
    </div>

    <div class="background" @click.stop="">
      <div
        class="content ql-editor"
        v-html="useUnescapeHTML(commonStore.store[activeNotice])"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { useUnescapeHTML } from "@/composables/unescapeHTML"

const commonStore = useCommonStore()

const activeNotice = ref("")

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

onMounted(() => {
  computeVideoSize()
})
</script>

<style lang="scss" scoped>
@import "@/styles/mixin/_button.scss";

.notice_list {
  width: 100%;
  // width: 960px;
  height: 50px;
  margin: 0 auto;
  margin-top: 30px;
  background: $secondColor_a;

  display: flex;
  justify-content: center;
  align-items: center;

  ul {
    display: flex;
    justify-content: center;

    li {
      @include button(
        auto,
        auto,
        6px 10px,
        0 5px,
        3px,
        $white,
        $secondColor_3,
        14
      );
      opacity: 1;

      &:hover {
        background-color: $secondColor_3;
        color: $white;
      }
    }
  }

  // @include l {
  //   width: 700px;
  // }
  // @include m {
  //   width: 450px;
  // }
  // @include s {
  //   width: 300px;
  // }
}

.notice_page {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 100;

  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: 15px;
    right: 15px;

    font-size: 30px;

    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    transition: 0.3s;
    z-index: 5;

    &:hover {
      transform: rotate(180deg);
    }
  }

  .background {
    width: 960px;
    height: 95%;
    padding: 25px;
    border-radius: 5px;
    box-shadow: 0 0 6px 2px $primaryColor;
    background-color: rgba(255, 255, 255, 0.95);
    position: relative;
    overflow-y: auto;

    .content {
      word-wrap: break-all;

      img {
        max-width: 100%;
      }
    }

    @include l {
      width: 700px;
    }
    @include m {
      width: 90%;
    }
  }
}
</style>
