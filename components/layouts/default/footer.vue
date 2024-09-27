<template>
  <footer class="footer">
    <div class="link_list">
      <ul>
        <li>
          <div class="title">關於我們</div>
          <ul class="link">
            <li
              v-for="item in commonStore.all.about"
              :key="item.ID"
              @click="useUrlPush(item.Link)"
            >
              {{ item.Name }}
            </li>
          </ul>
        </li>
        <li>
          <div class="title link">顧客服務</div>
          <ul class="link">
            <li
              v-for="item in commonStore.all.client"
              :key="item.ID"
              @click="useUrlPush(item.Link)"
            >
              {{ item.Name }}
            </li>
          </ul>
        </li>
        <li>
          <div class="title">聯絡我們</div>
          <ul v-if="commonStore.all.contact && commonStore.all.contact.length">
            <li v-if="commonStore.all.contact[0].Phone">
              客服電話｜{{ commonStore.all.contact[0].Phone }}
            </li>
            <li v-if="commonStore.all.contact[0].Email">
              客服信箱｜{{ commonStore.all.contact[0].Email }}
            </li>
            <li v-if="commonStore.all.contact[0].Open">
              服務時間｜{{ commonStore.all.contact[0].Open }}
            </li>

            <li v-if="commonStore.footer_community">
              <ul>
                <li
                  v-if="commonStore.footer_community.FBLink"
                  @click="useUrlPush(commonStore.footer_community.FBLink, 1)"
                >
                  <img src="@/assets/img/fb.png" alt="" />
                </li>
                <li
                  v-if="commonStore.footer_community.LineLink"
                  @click="useUrlPush(commonStore.footer_community.LineLink, 1)"
                >
                  <img src="@/assets/img/line.png" alt="" />
                </li>
                <li
                  v-if="commonStore.footer_community.IGLink"
                  @click="useUrlPush(commonStore.footer_community.IGLink, 1)"
                >
                  <img src="@/assets/img/ig.png" alt="" />
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <div
      class="footer_text"
      v-if="commonStore.copyRight && commonStore.copyRight.Footer"
    >
      {{ commonStore.copyRight.Footer.trim() }}
    </div>

    <div class="copyright">
      <template v-if="commonStore.copyRight && commonStore.copyRight.Text">
        {{ commonStore.copyRight.Text }}
      </template>
      <template v-else> Copyright © 2024 </template>
    </div>

    <div class="credit_list">
      <ul>
        <li v-if="commonStore.site.PayStatus * 1">
          <img
            src="https://d.line-scdn.net/linepay/portal/assets/img/portal/tw/logo.svg"
            alt=""
          />
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { useUrlPush } from "@/composables/urlPush"

const commonStore = useCommonStore()
</script>
