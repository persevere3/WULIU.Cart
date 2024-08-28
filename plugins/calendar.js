// 套件只支援 vue3 不支援 nuxt3 時可以用 use

import "v-calendar/dist/style.css"
import VCalendar from "v-calendar"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VCalendar)
})

// <v-date-picker v-model="new Date()" />
