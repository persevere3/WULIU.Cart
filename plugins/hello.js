export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      hello: (msg) => `Hello ${msg}!`
    }
  }
})

// $hello('J')
