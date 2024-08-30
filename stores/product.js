import {
  getCategoriesApi,
  getProductsApi,
  getAddProductsApi
} from "@/apis/product"

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

  const is_getCategories = ref(false)
  const categories = ref([])
  // category ID
  const category = ref("")

  const is_getProducts = ref(false)
  const products = ref([])
  const productsRendered = ref(false)

  // 是否為一頁式商品頁面
  const isSingleProduct = ref(false)
  // 選中的商品
  const selectedProduct = ref({})
  // 是否顯示加價購商品
  const isAddProducts = ref(true)
  // 是否顯示商品詳情
  const isDetail = ref(true)

  //
  const is_favorite_modal = ref(false)
  const favorite = ref({})

  watch(
    [is_getCategories, is_getProducts],
    () => {
      if (is_getCategories.value && is_getProducts.value) {
        categories.value.forEach((c) => {
          if (c.Show) category_products.value[c.ID] = c
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
            if (category_products.value[c]) {
              if (!category_products.value[c].products) {
                category_products.value[c].products = []
              }
              category_products.value[c].products.push(product)
            }
          })
        })

        category_products.value[0].products = products.value
      }
    },
    { deep: true }
  )

  watch(is_getProducts, () => {
    if (is_getProducts.value) productsHandler()
  })

  // methods ==============================
  async function getCategories() {
    let query = {
      Preview: commonStore.site.Preview
    }

    try {
      let res = JSON.parse(await getCategoriesApi(query))
      const isReqSuccess = commonStore.resHandler(res, getCategories)
      if (!isReqSuccess) return

      categories.value = [
        { ID: "0", Name: "所有分類商品", Show: "1" },
        ...res.data
      ]
      category.value = "0"

      is_getCategories.value = true
    } catch (error) {
      throw new Error(error)
    }
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
  async function getProducts() {
    let query = {
      Preview: commonStore.site.Preview
    }

    try {
      let res = JSON.parse(await getProductsApi(query))
      const isReqSuccess = commonStore.resHandler(res, getProducts)
      if (!isReqSuccess) return

      let originProducts = res.data
      let specs = res.data2 // 規格
      originProducts.forEach((product) => {
        // 規格 + buyQty ----------
        let productSpecArr = specs.filter(
          (spec) => spec.ProductID == product.ID
        )
        if (productSpecArr.length > 0) {
          productSpecArr.forEach((spec) => {
            spec.buyQty = 0
          })

          product.specArr = productSpecArr
          product.selectSpecItem = {}
          product.isShowSpec = false
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

      is_getProducts.value = true

      // nextTick
      setTimeout(() => {
        productsRendered.value = true
      }, 1000)
    } catch (error) {
      throw new Error(error)
    }
  }
  async function productsHandler() {
    category.value = "0"

    getFavorite()

    cartStore.getCart()
    cartStore.cartHandler()

    // if (cartCommonStore.showPage == "") cartCommonStore.showPage = "main"
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
      const isReqSuccess = commonStore.resHandler(res, getAddProducts, [ids])
      if (!isReqSuccess) return

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
          addProduct.selectSpecItem = {}
          addProduct.isShowOption = false
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

  function multiPriceHandler(data) {
    data.forEach((item) => {
      item.PriceType && (item.priceType = item.PriceType)
    })

    data.forEach((item) => {
      if (item.priceType === "multiPrice") {
        // 建議售價
        // 所有規格都有填建議售價
        if (item.MinPrice > 0 && item.MaxPrice > 0) {
          // 建議售價都一樣
          if (item.MinPrice === item.MaxPrice)
            item.priceRange = useNumberThousands(item.MinPrice)
          else
            item.priceRange = `${useNumberThousands(
              item.MinPrice
            )} - ${useNumberThousands(item.MaxPrice)}`
        }

        // 售價
        // 售價都一樣
        if (item.NowMinPrice === item.NowMaxPrice)
          item.nowPriceRange = useNumberThousands(item.NowMinPrice)
        else
          item.nowPriceRange = `${useNumberThousands(
            item.NowMinPrice
          )} - ${useNumberThousands(item.NowMaxPrice)}`
      }
    })
  }

  // 選中某商品
  async function selectProduct(item) {
    await getAddProducts(item)

    selectedProduct.value = item
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
        const isReqSuccess = commonStore.resHandler(res, getFavorite)
        if (!isReqSuccess) return

        favorite.value = {}
        if (res.status) {
          let favorite_list = res.datas[0] || []
          for (let item of favorite_list) {
            favorite.value[item.Product] = products.value.find(
              (product) => product.ID == favorite.Product
            )
          }
        } else {
          if (res.msg.indexOf("登入") > -1) {
            commonStore.user_account = ""
            localStorage.removeItem("user_account")
            getFavorite()
          }
        }
      } catch (error) {
        throw new Error(error)
      }
    }
    // 登出狀態
    else {
      let favoriteObj =
        JSON.parse(localStorage.getItem(`${commonStore.site.Name}@favorite`)) ||
        {}

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
        const isReqSuccess = commonStore.resHandler(res, toggleFavorite, [id])
        if (!isReqSuccess) return

        if (!res.status) {
          if (res.msg.indexOf("登入") > -1) {
            commonStore.user_account = ""
            localStorage.removeItem("user_account")
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
    categories,
    category,

    category_products,
    products,
    productsRendered,

    isSingleProduct,
    selectedProduct,
    isAddProducts,
    isDetail,

    is_favorite_modal,
    favorite,

    getCategories,
    getProducts,
    productsHandler,
    getAddProducts,

    multiPriceHandler,

    getFavorite,
    toggleFavorite
  }
})
