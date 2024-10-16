import { getProductsApi, getAddProductsApi } from "@/apis/product"
import {
  getFavoriteApi,
  deleteFavoriteApi,
  addFavoriteApi
} from "@/apis/favorite"

import { useRequest } from "@/composables/request"
import { useNumberThousands } from "@/composables/numberThousands"

export const useProductStore = defineStore("product", () => {
  const config = useRuntimeConfig()
  const commonStore = useCommonStore()
  const cartStore = useCartStore()

  const { return_formData } = useRequest()

  // state ==============================
  const category_products = ref({})

  const categories = ref([])
  // category ID
  const category = ref("")

  const products = ref([])
  const productsRendered = ref(false)

  // 是否為一頁式商品頁面
  const isSingleProduct = ref(false)
  // 是否顯示加價購商品
  const isAddProducts = ref(true)
  // 是否顯示商品詳情
  const isDetail = ref(true)

  //
  const is_favorite_modal = ref(false)
  const favorite = ref({})

  // methods ==============================
  async function categoriesHandler() {
    let data = commonStore.webData.GetCategory.data
    categories.value = [{ ID: "0", Name: "所有分類商品", Show: "1" }, ...data]
    category.value = "0"
  }

  function category_productsHandler() {
    let originCategory_products = {}

    categories.value.forEach((c) => {
      if (c.Show) originCategory_products[c.ID] = c
    })

    products.value.forEach((product) => {
      product.categories = [
        product.Category1,
        product.Category2,
        product.Category3,
        product.Category4,
        product.Category5
      ].filter((c) => c)

      product.categories.forEach((c) => {
        if (originCategory_products[c]) {
          if (!originCategory_products[c].products) {
            originCategory_products[c].products = []
          }
          originCategory_products[c].products.push(product)
        }
      })
    })

    originCategory_products[0].products = products.value

    category_products.value = originCategory_products
  }

  function returnPriceRange(product, priceKey) {
    let priceArr = product.specArr.map((spec) => spec[priceKey] * 1)
    let lowestPrice = Math.min(...priceArr)
    let highestPrice = Math.max(...priceArr)

    if (lowestPrice === highestPrice) return useNumberThousands(lowestPrice)
    else
      return `${useNumberThousands(lowestPrice)} - ${useNumberThousands(
        highestPrice
      )}`
  }

  async function ajaxProducts() {
    let query = { Preview: commonStore.site.Preview }

    try {
      const res = JSON.parse(await getProductsApi(query))
      const isResSuccess = commonStore.resHandler(res)
      if (!isResSuccess) return ajaxProducts()

      productsHandler(res)
    } catch (error) {
      console.log(error)
    }
  }
  async function productsHandler(res) {
    let originProducts = res.data
    let specs = res.data2 // 規格
    originProducts.forEach((product) => {
      // 規格 + buyQty ----------
      let productSpecArr = specs.filter((spec) => spec.ProductID == product.ID)
      if (productSpecArr.length > 0) {
        productSpecArr.forEach((spec) => {
          spec.buyQty = 0
        })

        product.specArr = productSpecArr
      } else product.buyQty = 0

      // 多價格 ----------
      product.PriceType && (product.priceType = product.PriceType)
      if (product.priceType === "multiPrice") {
        // 建議售價
        product.priceRange = returnPriceRange(product, "ItemPrice")

        // 售價
        product.nowPriceRange = returnPriceRange(product, "ItemNowPrice")
      }

      // categoryArr -----------
      let categoryArr = [
        product.Category1,
        product.Category2,
        product.Category3,
        product.Category4,
        product.Category5
      ]
      categoryArr = categoryArr.filter((category) => category)
      product.categoryArr = categoryArr

      // imgArr, mainImgIndex, Img1 ----------
      let imgArr = [
        product.Img1,
        product.Img2,
        product.Img3,
        product.Img4,
        product.Img5
      ]
      imgArr = imgArr.filter((img) => img)

      if (process.env.NODE_ENV === "development") {
        // 圖片列表
        imgArr = imgArr.map((img) => config.public.apiUrl + img)
        // 主要圖片
        product.Img1 = config.public.apiUrl + product.Img1
      }

      product.imgArr = imgArr
      product.mainImgIndex = 0

      // addProducts ----------
      product.addProducts = null
    })

    //
    products.value = originProducts

    //
    category_productsHandler()

    category.value = "0"

    getFavorite()

    cartStore.getCart()
    cartStore.cartHandler()

    await nextTick()
    productsRendered.value = true
  }

  async function getAddProducts(ids) {
    ids.forEach((id, index) => {
      let product = products.value.find((product) => product.ID == id)
      if (product.addProducts) ids[index] = null
    })
    ids = ids.filter((item) => item)
    if (ids.length < 1) return

    let id = ids.join()

    let query = {
      id,
      Preview: commonStore.site.Preview
    }

    try {
      let res = JSON.parse(await getAddProductsApi(query))
      const isReqSuccess = commonStore.resHandler(res)
      if (!isReqSuccess) return getAddProducts(ids)

      let addProducts = res.data
      let originSpecs = res.data2 // 規格
      let specs = []
      originSpecs.forEach((item) => {
        let spec = specs.find((spec) => spec.ID == item.ID)
        if (!spec) specs.push(item)
      })
      addProducts.forEach((addProduct) => {
        // 規格 + buyQty ----------
        let addProductSpecArr = specs.filter(
          (spec) => spec.ProductID1 == addProduct.ID
        )
        if (addProductSpecArr.length > 0) {
          addProductSpecArr.forEach((spec) => {
            spec.buyQty = 0
          })

          addProduct.specArr = addProductSpecArr
        } else addProduct.buyQty = 0

        // 多價格 ----------
        addProduct.PriceType && (addProduct.priceType = addProduct.PriceType)

        if (addProduct.priceType === "multiPrice") {
          addProduct.nowPriceRange = returnPriceRange(
            addProduct,
            "ItemNowPrice"
          )
        }

        // Img ----------
        if (process.env.NODE_ENV === "development")
          addProduct.Img = config.public.apiUrl + addProduct.Img
      })

      //
      let productsObj = {}
      addProducts.forEach((addProduct) => {
        if (!productsObj[addProduct.ProductId])
          productsObj[addProduct.ProductId] = []
        productsObj[addProduct.ProductId].push(addProduct)
      })

      for (let key in productsObj) {
        let item = productsObj[key]
        let product = products.value.find((product) => product.ID === key)
        if (product) product.addProducts = item
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  // favorite
  async function getFavorite() {
    // 登入狀態
    if (commonStore.user_account) {
      let obj = {
        storeid: commonStore.site.Name,
        phone: commonStore.user_account
      }
      let formData = return_formData(obj)

      try {
        let res = JSON.parse(await getFavoriteApi(formData))
        const isReqSuccess = commonStore.resHandler(res)
        if (!isReqSuccess) return getFavorite()

        favorite.value = {}
        if (res.status) {
          let favorite_list = res.datas[0] || []
          for (let item of favorite_list) {
            favorite.value[item.Product] = products.value.find(
              (product) => product.ID == item.Product
            )
          }
        } else {
          if (res.msg.indexOf("登入") > -1) {
            commonStore.user_account = ""
            getFavorite()
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    }
    // 登出狀態
    else {
      let localFavorite = localStorage.getItem(
        `${commonStore.site.Name}@favorite`
      )
      let favoriteObj
      if (localFavorite) {
        favoriteObj = JSON.parse(localFavorite)
      } else {
        favoriteObj = {}
      }

      for (let key in favoriteObj) {
        let product = products.value.find(
          (product) => product.ID === favoriteObj[key].ID
        )
        if (product) favoriteObj[key] = JSON.parse(JSON.stringify(product))
      }

      favorite.value = favoriteObj
    }
  }
  async function toggleFavorite(id) {
    // 登入狀態
    if (commonStore.user_account) {
      let obj = {
        storeid: commonStore.site.Name,
        phone: commonStore.user_account,
        "productid[]": id
      }
      let formData = return_formData(obj)

      try {
        let api = favorite.value[id] ? deleteFavoriteApi : addFavoriteApi
        let res = JSON.parse(await api(formData))
        const isReqSuccess = commonStore.resHandler(res)
        if (!isReqSuccess) return toggleFavorite(id)

        if (!res.status) {
          if (res.msg.indexOf("登入") > -1) {
            commonStore.user_account = ""
          }
        }

        getFavorite()
      } catch (error) {
        throw new Error(error)
      }
    }
    // 登出狀態
    else {
      if (favorite.value[id]) delete favorite.value[id]
      else favorite.value[id] = products.value.find((item) => item.ID === id)
      localStorage.setItem(
        `${commonStore.site.Name}@favorite`,
        JSON.stringify(favorite.value)
      )
    }
  }

  return {
    category_products,

    categories,
    category,

    products,
    productsRendered,

    isSingleProduct,
    isAddProducts,
    isDetail,

    is_favorite_modal,
    favorite,

    categoriesHandler,
    category_productsHandler,
    ajaxProducts,
    productsHandler,
    getAddProducts,

    getFavorite,
    toggleFavorite
  }
})
