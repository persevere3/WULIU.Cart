<script setup>
import { useUnescapeHTML } from "@/composables/unescapeHTML"

const config = useRuntimeConfig()
const commonStore = useCommonStore()

const rich_id = ref(0)
const rich_cid = ref(0)
const content_obj = ref(null)

function toObj(arr) {
  let obj = {}
  if (!arr || !arr.length) return
  arr.forEach((item) => (obj[item.ID] = item))
  return obj
}
function initRich() {
  const { id, cid } = useRoute().query

  rich_id.value = id
  rich_cid.value = cid

  // rich_cid 0 第二層選單
  if (rich_cid.value === "0") {
    content_obj.value = toObj(commonStore.all.websubcategory)
  }
  // rich_cid 1 2 頁尾連結
  else if (rich_cid.value === "1" || rich_cid.value === "2") {
    content_obj.value = toObj(commonStore.all.footer)
  }
  // rich_cid 3 第一層選單
  else if (rich_cid.value === "3") {
    content_obj.value = toObj(commonStore.all.webcategory)
  }

  if (process.env.NODE_ENV === "development") {
    if (
      content_obj.value[rich_id.value].Text.indexOf(
        `img src="${config.public.apiUrl}`
      ) > -1
    )
      return

    content_obj.value[rich_id.value].Text = content_obj.value[
      rich_id.value
    ].Text.replaceAll('img src="', 'img src="' + config.public.apiUrl)
  }
}

watch(
  () => commonStore.is_getAll,
  () => {
    if (commonStore.is_getAll) initRich()
  },
  { immediate: true }
)

const fullPath = computed(() => useRoute().fullPath)
watch(fullPath, async () => {
  initRich()
})
</script>

<template>
  <div class="rich" v-if="content_obj">
    <div class="title">
      {{ content_obj[rich_id].Name }}
    </div>
    <div class="rich_container">
      <div
        class="ql-editor"
        v-html="useUnescapeHTML(content_obj[rich_id].Text)"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/pages/rich.scss";
</style>
