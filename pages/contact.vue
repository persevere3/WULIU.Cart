<script setup>
import { getContactApi } from "@/apis/pages"

import { useUnescapeHTML } from "@/composables/unescapeHTML"

import { useRequest } from "@/composables/request"

let { return_formData } = useRequest()

const commonStore = useCommonStore()

const contact = ref({})

async function ajaxContact() {
  let query = {
    WebPreview: commonStore.site.WebPreview || 1
  }

  let formData = return_formData(query)

  try {
    const res = JSON.parse(await getContactApi(formData))
    const isResSuccess = commonStore.resHandler(res)
    if (!isResSuccess) return ajaxContact()

    return res.data[0]
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  let resData = await ajaxContact()
  contact.value = resData
})

// watch ========== ========== ========== ========== ==========
watch(
  () => commonStore.is_initial,
  () => {
    contact.value = commonStore.webData.GetWebContact.data[0]
  }
)
</script>

<template>
  <div class="contact" v-if="contact">
    <div class="opening">
      <div class="title">
        <p>〈 服務時間 〉</p>
      </div>
      <div class="text">
        <ul>
          <li v-if="contact.Open">{{ contact.Open }}</li>
        </ul>
      </div>
    </div>

    <div class="info">
      <div class="title">
        <p>〈 聯絡資訊 〉</p>
      </div>
      <div class="text">
        <ul>
          <li v-if="contact.Phone">電話客服｜{{ contact.Phone }}</li>
          <li v-if="contact.Email">Email｜{{ contact.Email }}</li>
          <li v-if="contact.Line">LINE｜{{ contact.Line }}</li>
          <li v-if="contact.FBName">
            FB粉絲團｜
            <nuxt-link :to="contact.FBLink">
              {{ contact.FBName }}
            </nuxt-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="location">
      <div class="left">
        <div class="title">
          <p>〈 公司位置 〉</p>
        </div>
        <div class="text">
          <ul>
            <li v-if="contact.Address">
              <div class="item_name">地址｜</div>
              <div>{{ contact.Address }}</div>
            </li>
            <li v-if="contact.Text">
              <div class="item_name">備註｜</div>
              <div>{{ contact.Text }}</div>
            </li>
            <li v-if="contact.Traffic">
              <div class="item_name">交通方式｜</div>
              <div>{{ contact.Traffic }}</div>
            </li>
          </ul>
        </div>
      </div>
      <div
        class="right"
        v-if="contact.Map"
        v-html="useUnescapeHTML(contact.Map)"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/pages/contact.scss";
</style>

<style lang="scss">
.contact {
  iframe {
    width: 100%;
  }
}
</style>
