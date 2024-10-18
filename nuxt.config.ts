// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: true,

  //
  runtimeConfig: {
    public: {
      apiUrl: "https://demo.uniqcarttest.com/"
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
      viewport: "width=500, initial-scale=1"
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
        },
        "/LineMK": {
          target: "https://demo.uniqcarttest.com",
          changeOrigin: true
        }
      }
    }
  }
})
