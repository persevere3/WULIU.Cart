<template>
  <!-- fb -->
  <div id="fb-root"></div>
  <div id="fb-customer-chat" class="fb-customerchat"></div>

  <!-- line -->
  <div
    class="line_icon"
    v-if="commonStore.customerService && commonStore.customerService.CSText"
    @click="useUrlPush(commonStore.customerService.CSText, true)"
  >
    <img src="@/assets/img/line_icon.png" alt="" />
  </div>

  <!-- chat controler -->
  <div
    class="chat_controler"
    @click="is_chat = !is_chat"
    v-show="
      commonStore.customerService.Text ||
      commonStore.customerService.CSText ||
      commonStore.customerService.FBText
    "
  >
    <i class="fa-solid fa-comment-dots" v-if="!is_chat"></i>
    <i class="fa-solid fa-comment-slash" v-else></i>
  </div>
</template>

<script setup>
import { useUrlPush } from "@/composables/urlPush"

const commonStore = useCommonStore()

//
const is_chat = ref(false)
const isTawkAddClick = ref(false)
const isTawkOpen = ref(false)

watch(is_chat, (val) => {
  let arr = []

  let tawkbutton
  let tawkchat
  let tawks = document.querySelectorAll(".widget-visible iframe")
  if (tawks.length) {
    tawks[0].style.transition = ".5s"
    tawkbutton = tawks[0].contentWindow.document.querySelector("button")
    tawkchat = tawks[1]

    // 綁定 click
    if (!isTawkAddClick.value) {
      tawkbutton.addEventListener("click", function () {
        if (isTawkOpen.value) {
          setTimeout(() => {
            tawkchat.style.bottom =
              parseInt(window.getComputedStyle(tawks[0]).bottom) + 70 + "px"
            tawkchat.style.right = 95 + "px"
          }, 0)
        } else {
          tawkchat.style.bottom =
            parseInt(window.getComputedStyle(tawks[0]).bottom) + "px"
          tawkchat.style.right = 95 + "px"
        }
      })
      isTawkAddClick.value = true
    }

    if (isTawkOpen.value) {
      tawkbutton.click()
      isTawkOpen.value = false
    }

    arr.push(tawks)
  }

  let line = document.querySelector(".line_icon")
  if (line) arr.push(line)

  let fbchat
  let fbs = document.querySelectorAll(".fb_dialog iframe")
  if (fbs.length) {
    for (let item of fbs) {
      item.style.transition = ".5s"
    }
    fbchat = document.querySelector(".fb_iframe_widget iframe")
    fbchat.style.height = 550 + "px"
    fbchat.style.right = 95 + "px"
    arr.push(fbs)
  }

  if (val) {
    let bottom = 90
    for (let item of arr) {
      // line
      if (!item.length) {
        item.style.bottom = bottom + "px"
      }
      // tawk
      else if (item[0].parentNode.classList.contains("widget-visible")) {
        // chat 開關
        if (tawkchat.classList.contains("open")) {
          setTimeout(() => {
            tawkchat.style.display = "block"
          }, 200)
        }

        // icon 移動
        item[0].style.bottom = bottom + "px"
      }
      // fb
      else {
        // chat 開關
        if (fbchat.style.maxHeight != "0px") {
          fbchat.style.display = "block"
        }

        // icon 移動
        item[0].style.bottom = bottom + "px"
        item[1].style.bottom = bottom - 2.5 + "px"
        item[2].style.bottom = bottom + 44 + "px"

        // chat 移動
        fbchat.style.bottom = bottom - 10 + "px"
      }

      bottom += 70
    }
  } else {
    for (let item of arr) {
      // line
      if (!item.length) {
        item.style.bottom = "20px"
      }
      // tawk
      else if (item[0].parentNode.classList.contains("widget-visible")) {
        // chat 開關
        if (tawkchat.classList.contains("open")) {
          tawkchat.style.display = "none"
        }

        // icon 移動
        item[0].style.bottom = "20px"
      }
      // fb
      else {
        // chat 開關
        if (fbchat.style.maxHeight != "0px") {
          fbchat.style.display = "none"
        }

        // icon 移動
        for (let item2 of item) {
          item2.style.bottom = "20px"
        }
      }
    }
  }
})

onMounted(() => {
  window.addEventListener("webkitAnimationStart", function (event) {
    if (event.animationName === "fbchatInserted") {
      let iframe = event.target.querySelector("iframe")

      let observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.attributeName == "style") {
            if (mutation.target.style.maxHeight.indexOf("px") > -1) {
              let fb = document.querySelector("#fb-root")
              let icon = document.querySelector(".fb_dialog iframe")
              // icon 移動
              icon.style.bottom = "20px"
              icon.style["box-shadow"] = "none"
              // icon 顯示
              setTimeout(() => {
                fb.style.opacity = 1
              }, 1000)

              // chat 開關
              if (mutation.target.style.maxHeight != "0px") {
                // 隱藏
                iframe.style.display = "none"
              }
              // 取消
              observer.disconnect()
            }
          }
        })
      })
      observer.observe(iframe, { attributes: true })
    } else if (event.animationName === "tawkchatInserted") {
      let iframe = event.target
      let iframeStyle = window.getComputedStyle(iframe)
      if (iframeStyle.display.indexOf("block") > -1) {
        setTimeout(() => {
          let tawkbutton = document
            .querySelector(".widget-visible iframe")
            .contentWindow.document.querySelector("button")
          tawkbutton.click()
          isTawkOpen.value = true
        }, 0)
      }
    }
  })
})
</script>
