// apis
import { discountApi, getTotalApi } from "@/apis/cart"

// composables
import { useNumberThousands } from "@/composables/numberThousands"
import { useRequest } from "@/composables/request"

export const useCartStore = defineStore("cart", () => {
  let commonStore = useCommonStore()
  let productStore = useProductStore()
  let purchaseInfoStore = usePurchaseInfoStore()

  let { return_formData } = useRequest()

  // state ==============================
  const is_cart_modal = ref(false)
  const cart = ref([])
  // 取得購物車後的商品數量
  const cartOriginLength = ref(0)

  const step = ref(1) // 1 ~ 3

  // 折扣碼
  const discountCode = ref("")
  const successUsedDiscountCode = ref("")
  const discountErrorMessage = ref("")

  // bonus
  const bonus_array = ref([])
  const is_use_bonus = ref(false)
  const use_bonus = ref(0)

  //
  const total = ref({})

  // computed ==============================
  // 購物車內商品數量
  const cartLength = computed(() => {
    let cartLength = 0

    cart.value.forEach((cartItem) => {
      // 有規格
      if (cartItem.specArr)
        cartLength += cartItem.specArr.filter((spec) => spec.buyQty > 0).length
      // 沒規格
      else cartLength += 1

      // 加價購
      if (cartItem.addProducts) {
        cartItem.addProducts.forEach((addProduct) => {
          // 有規格
          if (addProduct.specArr)
            cartLength += addProduct.specArr.filter(
              (spec) => spec.buyQty > 0
            ).length
          // 沒規格
          else if (addProduct.buyQty > 0) cartLength += 1
        })
      }
    })

    return cartLength
  })
  // 回饋%數
  const bonus_percent = computed(() => {
    let bonus_percent = 0
    for (let item of bonus_array.value) {
      if (
        parseInt(total.value.Sum) - parseInt(total.value.Shipping) >=
        parseInt(item.lower)
      )
        bonus_percent = parseInt(item.shipping)
    }
    return bonus_percent
  })
  // 消費回饋
  const member_bonus = computed(() => {
    return Math.floor(
      (parseInt(total.value.Sum) - parseInt(total.value.Shipping)) *
        (bonus_percent.value / 100)
    )
  })

  // methods ==============================
  function getCart() {
    let key = ""
    if (productStore.isSingleProduct) {
      key = `${commonStore.site.Name}@${productStore.selectedProduct.ID}@cart`
    } else {
      if (commonStore.user_account)
        key = `${commonStore.site.Name}@${commonStore.user_account}@cart`
      else key = `${commonStore.site.Name}@cart`
    }

    cart.value = JSON.parse(localStorage.getItem(key)) || []

    cartOriginLength.value = cartLength.value
  }
  async function cartHandler() {
    // 購物車有商品，列表沒有 => 商品從購物車中移除
    // 購物車商品有加價購，列表商品沒有加價購 => getAddProducts()
    let ids = []
    cart.value.forEach((cartItem) => {
      let product = productStore.products.find(
        (product) => product.ID == cartItem.ID
      )
      // 購物車有商品，列表沒有
      if (!product) {
        cartItem = null
      } else {
        // 購物車商品有加價購，列表商品沒有加價購
        if (cartItem.addProducts && !product.addProducts) ids.push(cartItem.ID)
      }
    })
    cart.value = cart.value.filter((item) => item)

    if (ids.length) await productStore.getAddProducts(ids)

    asyncCart()
    if (cartOriginLength.value != cartLength.value)
      commonStore.showMessage("抱歉，您選購的商品已下架", false)

    //
    await purchaseInfoStore.filter_use_bonus(0)
  }

  // cartItem addProcucts 購買數量 => product addProcucts
  function cartItemAddProcuctsQtyToProduct(cartItem, product) {
    let mainTotalQty = getMainTotalQty(product)
    if (cartItem.addProducts && product.addProducts) {
      cartItem.addProducts.forEach((cartItemAddProduct) => {
        let productAddProduct = product.addProducts.find(
          (productAddProduct) => productAddProduct.ID == cartItemAddProduct.ID
        )
        if (productAddProduct) {
          // 都有規格
          if (cartItemAddProduct.specArr && productAddProduct.specArr) {
            cartItemAddProduct.specArr.forEach((cartItemAddProductSpec) => {
              let productAddProductSpec = productAddProduct.specArr.find(
                (productAddProductSpec) =>
                  productAddProductSpec.ID == cartItemAddProductSpec.ID
              )
              if (productAddProductSpec) {
                productAddProductSpec.buyQty = cartItemAddProductSpec.buyQty

                // 檢查庫存
                if (productAddProductSpec.Enable == 1) {
                  let othersQty = getOthersAddProductQty(
                    product.ID,
                    productAddProduct,
                    productAddProductSpec
                  )
                  if (
                    productAddProductSpec.buyQty + othersQty >
                    productAddProductSpec.Amount
                  ) {
                    if (othersQty == 0) {
                      productAddProductSpec.buyQty =
                        productAddProductSpec.Amount
                    } else {
                      let leftQty = productAddProductSpec.Amount - othersQty
                      if (leftQty <= 0) productAddProductSpec.buyQty = 0
                      else productAddProductSpec.buyQty = leftQty
                    }
                  }
                }

                // 檢查加購數量是否超過主商品
                if (productAddProductSpec.buyQty > mainTotalQty) {
                  productAddProductSpec.buyQty = mainTotalQty
                }
              }
            })
          }
          // 都沒規格
          else if (!cartItemAddProduct.specArr && !productAddProduct.specArr) {
            productAddProduct.buyQty = cartItemAddProduct.buyQty
            // 檢查庫存
            if (productAddProduct.Enable == 1) {
              let othersQty = getOthersAddProductQty(
                product.ID,
                productAddProduct
              )
              if (
                productAddProduct.buyQty + othersQty >
                productAddProduct.Amount
              ) {
                if (othersQty == 0)
                  productAddProduct.buyQty = productAddProduct.Amount
                else {
                  let leftQty = productAddProduct.Amount - othersQty
                  if (leftQty <= 0) productAddProduct.buyQty = 0
                  else productAddProduct.buyQty = leftQty
                }
              }
            }
            // 檢查加購數量是否超過主商品
            if (productAddProduct.buyQty > mainTotalQty) {
              productAddProduct.buyQty = mainTotalQty
            }
          }
        }
      })
    }
  }
  function asyncCart() {
    console.log("asyncCart")
    cart.value.forEach((cartItem, cartIndex) => {
      let product = productStore.products.find(
        (product) => product.ID == cartItem.ID
      )
      if (product) {
        // cart 購買數量 => product ----------
        // 都有規格
        if (cartItem.specArr && product.specArr) {
          cartItem.specArr.forEach((cartItemSpec) => {
            let productSpec = product.specArr.find(
              (productSpec) => productSpec.ID == cartItemSpec.ID
            )
            if (productSpec) {
              productSpec.buyQty = cartItemSpec.buyQty
              if (
                productSpec.Enable == 1 &&
                productSpec.buyQty > productSpec.Amount
              ) {
                productSpec.buyQty = productSpec.Amount
              }
            }
          })
        }
        // 都沒規格
        else if (!cartItem.specArr && !product.specArr) {
          product.buyQty = cartItem.buyQty
          if (product.Enable == 1 && product.buyQty > product.Amount) {
            product.buyQty = product.Amount
          }
        }

        // main product 購買數量如果為0 cartItem => null ----------
        let mainTotalQty = getMainTotalQty(product)
        if (mainTotalQty < 1) cartItem = null

        // main product 購買數量不為0 ----------
        if (cartItem) {
          // cartItem addProcucts 購買數量 => product addProcucts
          cartItemAddProcuctsQtyToProduct(cartItem, product)

          // copy procuct => cart ----------
          cart.value[cartIndex] = JSON.parse(JSON.stringify(product))
        }
      }
    })
    cart.value = cart.value.filter((item) => item)

    setCart()
  }

  function setCart() {
    let key = ""
    if (productStore.isSingleProduct)
      key = `${commonStore.site.Name}@${productStore.selectedProduct.ID}@cart`
    else {
      if (commonStore.user_account)
        key = `${commonStore.site.Name}@${commonStore.user_account}@cart`
      else key = `${commonStore.site.Name}@cart`
    }

    localStorage.setItem(key, JSON.stringify(cart.value))
  }
  function clearCart() {
    cart.value = []
    setCart()

    unDiscount()

    is_use_bonus.value = false
    use_bonus.value = 0

    // if (!productStore.isSingleProduct) {
    //   commonStore.showPage = "main"
    //   productStore.getCategories()
    // } else cartStore.step = 1

    // await productStore.getProducts()
    // productStore.productsHandler()
  }

  async function discount() {
    if (!discountCode.value) {
      discountErrorMessage.value = "請輸入折扣碼"
      return
    }

    let query = {
      code: discountCode.value,
      Preview: commonStore.site.Preview
    }

    try {
      let res = JSON.parse(await discountApi(query))
      const isReqSuccess = commonStore.resHandler(res, discount)
      if (!isReqSuccess) return

      let status = res.data[0].status
      if (status === "1") {
        successUsedDiscountCode.value = discountCode.value
        discountErrorMessage.value = ""
        commonStore.showMessage("恭喜您獲得折扣", true)
      } else {
        discountCode.value = ""
        successUsedDiscountCode.value = ""

        if (status === "0") discountErrorMessage.value = "您的折扣碼無效"
        else if (status === "2") discountErrorMessage.value = "此折扣碼已使用完"
        commonStore.showMessage(
          `抱歉!${discountErrorMessage.value}，請重新輸入`,
          false
        )
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  function unDiscount() {
    discountCode.value = ""
    successUsedDiscountCode.value = ""
    discountErrorMessage.value = ""
  }

  // 查 金額, 折扣, 運費, 總計
  async function getTotal(isStepTwo) {
    console.log("getTotal")

    let {
      id,
      qry,
      additionalid,
      additionalqry,
      specificationid,
      specificationqty
    } = createCartStrObj()

    if (!id && !specificationid) return

    isStepTwo = isStepTwo ? 1 : 0

    let shipping
    if (purchaseInfoStore.transport === "0") shipping = 3
    else if (purchaseInfoStore.transport === "1") shipping = 2
    else if (purchaseInfoStore.transport === "2") shipping = 3
    else shipping = 4

    let query = {
      id,
      qry,
      additionalid,
      additionalqry,
      specificationid,
      specificationqty,

      storeid: commonStore.site.Name,
      type: isStepTwo,
      code: successUsedDiscountCode.value,
      shipping,
      memberWallet: is_use_bonus.value ? use_bonus.value : 0,
      Preview: commonStore.site.Preview
    }

    if (shipping === 4) query["Mart"] = purchaseInfoStore.transport

    try {
      let res = JSON.parse(await getTotalApi(return_formData(query)))
      const isReqSuccess = commonStore.resHandler(res, getTotal, [isStepTwo])
      if (!isReqSuccess) return

      let originTotal = res.data[0]
      originTotal.FreeItem = JSON.parse(originTotal.FreeItem)

      total.value = originTotal
    } catch (error) {
      throw new Error(error)
    }
  }
  function createCartStrObj() {
    let cartStrObj = {
      id: "",
      price: "",
      qry: "",

      additionalid: "",
      additionalprice: "",
      additionalqry: "",

      specificationid: "",
      specificationqty: "",

      ItemName: ""
    }

    cart.value.forEach((cartItem) => {
      let nowPriceStr = useNumberThousands(cartItem.NowPrice)

      // 有規格
      if (cartItem.specArr) {
        cartItem.specArr.forEach((spec) => {
          if (spec.buyQty != 0) {
            cartStrObj.specificationid +=
              (cartStrObj.specificationid ? "," : "") + spec.ID
            cartStrObj.specificationqty +=
              (cartStrObj.specificationqty ? "," : "") + spec.buyQty
            cartStrObj.ItemName +=
              (cartStrObj.ItemName ? "#" : "") +
              `${cartItem.Name} (${spec.Name}) NT$${nowPriceStr} x ${spec.buyQty}`
          }
        })
      }
      // 沒規格
      else {
        cartStrObj.id += (cartStrObj.id ? "," : "") + cartItem.ID
        cartStrObj.price += (cartStrObj.price ? "," : "") + cartItem.NowPrice
        cartStrObj.qry += (cartStrObj.qry ? "," : "") + cartItem.buyQty
        cartStrObj.ItemName +=
          (cartStrObj.ItemName ? "#" : "") +
          `${cartItem.Name} NT$${nowPriceStr} x ${cartItem.buyQty}`
      }

      // 加價購
      if (cartItem.addProducts) {
        cartItem.addProducts.forEach((addProduct) => {
          let addProductStr = useNumberThousands(addProduct.Price)

          // 有規格
          if (addProduct.specArr) {
            addProduct.specArr.forEach((addProductSpec) => {
              if (addProductSpec.buyQty) {
                cartStrObj.specificationid +=
                  (cartStrObj.specificationid ? "," : "") + addProductSpec.ID
                cartStrObj.specificationqty +=
                  (cartStrObj.specificationqty ? "," : "") +
                  addProductSpec.buyQty
                cartStrObj.ItemName +=
                  (cartStrObj.ItemName ? "#" : "") +
                  +`加價購 ${addProductSpec.Name} (${addProductSpec.Name}) NT$${addProductStr} x ${addProductSpec.buyQty}`
              }
            })
          }
          // 沒規格
          else {
            if (addProduct.buyQty != 0) {
              cartStrObj.additionalid +=
                (cartStrObj.additionalid ? "," : "") + addProduct.ID
              cartStrObj.additionalprice +=
                (cartStrObj.additionalprice ? "," : "") + addProduct.Price
              cartStrObj.additionalqry +=
                (cartStrObj.additionalqry ? "," : "") + addProduct.buyQty
              cartStrObj.ItemName +=
                (cartStrObj.ItemName ? "#" : "") +
                `加價購 ${addProduct.Name} NT$${addProductStr} x ${addProduct.buyQty}`
            }
          }
        })
      }
    })

    return cartStrObj
  }

  // 查 主商品 購買數量
  function getMainTotalQty(main) {
    if (main.specArr)
      return main.specArr.reduce(
        (accumulator, currentSpec) => accumulator + currentSpec.buyQty,
        0
      )
    else return main.buyQty
  }
  // 其他主商品下此加價購商品的購買數量總和
  function getOthersAddProductQty(id, item, spec) {
    let filterCart = cart.value.filter(
      (cartItem) =>
        cartItem.ID != id &&
        cartItem.addProducts &&
        cartItem.addProducts.length > 0
    )
    return filterCart.reduce((accumulator, cartItem) => {
      let addProduct = cartItem.addProducts.find(
        (addProduct) => addProduct.ID == item.ID
      )
      if (addProduct) {
        if (spec) {
          let addProductSpec = addProduct.specArr.find(
            (addProductSpec) => addProductSpec.ID == spec.ID
          )
          if (addProductSpec) return addProductSpec.buyQty * 1
        } else return accumulator + addProduct.buyQty
      }
    }, 0)
  }

  return {
    is_cart_modal,

    cart,
    cartOriginLength,

    step,

    discountCode,
    successUsedDiscountCode,
    discountErrorMessage,

    bonus_array,
    is_use_bonus,
    use_bonus,

    total,

    cartLength,
    member_bonus,

    getCart,
    cartHandler,

    cartItemAddProcuctsQtyToProduct,
    asyncCart,

    setCart,
    clearCart,

    discount,
    unDiscount,

    getTotal,
    createCartStrObj,

    getMainTotalQty,
    getOthersAddProductQty
  }
})
