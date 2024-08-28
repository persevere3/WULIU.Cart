// import dayjs from "dayjs"
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("timeformat", {
    mounted(el, binding) {
      // const time = dayjs(binding.value).format("YYYY-MM-DD")
      time = binding.value
      el.innerText = time
    }
  })
})

// <h1 v-timeformat="'2021-09-16T01:52:45.780Z'"></h1>
