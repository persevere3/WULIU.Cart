// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  //
  runtimeConfig: {
    public: {
      apiUrl: "https://demo.uniqcarttest.com"
    }
  },

  // auto import
  components: {
    dirs: [
      {
        path: "~/components/global",
        global: true
      }
    ]
  },
  imports: {
    dirs: ["stores"]
  },

  css: ["@/styles/_all.scss"],

  // modules
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs", "acceptHMRUpdate"]
      }
    ]
  ],

  // https://nuxt.com/docs/api/configuration/nuxt-config#head
  app: {
    head: {
      viewport: "width=500, initial-scale=1",
      title: "Nuxt3 高效入門全攻略",
      meta: [
        {
          name: "description",
          content: "這是 Mike 的 Nuxt3 高效入門全攻略課程"
        },
        { property: "og:title", content: "Nuxt3 高效入門全攻略" },
        { property: "og:url", content: "http://localhost:3000/" },
        {
          property: "og:description",
          content: "這是 Mike 的 Nuxt3 高效入門全攻略課程"
        }
      ]
    }
  },

  vite: {
    define: {
      "process.env": process.env
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/mixin/_common.scss";
            @import "@/styles/_variable.scss";
          `
        }
      }
    },
    server: {
      proxy: {
        "/interface": {
          target: "https://demo.uniqcarttest.com",
          changeOrigin: true
        }
      }
    }
  }
})
