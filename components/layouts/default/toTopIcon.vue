<template>
  <div
    class="scrollto_top"
    @click="scrollto(0)"
    :class="{ is_show: defaultLayoutStore.window_scrollTop > 100 }"
  >
    <i class="fa fa-arrow-up" aria-hidden="true"></i>
  </div>
</template>

<script setup>
const defaultLayoutStore = useDefaultLayoutStore()

// scroll
function scrollto(targetOffsetTop) {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  let step = 50

  function move() {
    if (scrollTop > targetOffsetTop) {
      scrollTop =
        scrollTop - step < targetOffsetTop ? targetOffsetTop : scrollTop - step
    } else if (scrollTop < targetOffsetTop) {
      scrollTop =
        scrollTop + step > targetOffsetTop ? targetOffsetTop : scrollTop + step
    } else {
      clearInterval(interval)
    }
    document.body.scrollTop = scrollTop
    document.documentElement.scrollTop = scrollTop
  }
  let interval = setInterval(move, 10)
}
function scrollHandler() {
  defaultLayoutStore.window_scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop
}

onMounted(() => {
  window.addEventListener("scroll", scrollHandler)
})
</script>
