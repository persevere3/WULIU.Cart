import { getAmountApi } from "@/apis/product"

import { useNumber } from "@/composables/number"

export const useBuyQtyHandlerStore = defineStore("buyQtyHandler", () => {
  let commonStore = useCommonStore()
  let productStore = useProductStore()
  let cartStore = useCartStore()

  // state ==============================
  const flyItem = ref(null)
  const flyImgTop = ref(100)
  const flyImgLeft = ref(0)
  const isShrink = ref(0)

  // methods ==============================
  // 改變 主商品數量
  async function changeMainBuyQty(main, specIndex, qty, e) {
    console.log(main, specIndex, qty)

    let spec = specIndex == null ? null : main.specArr[specIndex]
    let target = spec ? spec : main

    // getAmount => update庫存, 檢查是否上架
    if (spec) {
      let isMarket = await getAmount(main, null, spec)
      if (!isMarket) {
        commonStore.showMessage("抱歉，您選購的規格已下架", false)
        await productStore.getProducts()
        productStore.productsHandler()
        return
      }
    } else {
      let isMarket = await getAmount(main)
      if (!isMarket) {
        commonStore.showMessage("抱歉，您選購的商品已下架", false)
        await productStore.getProducts()
        productStore.productsHandler()
        return
      }
    }

    // 基本校驗 非文字 or >999 => 0
    qty = useNumber(qty)
    if (qty > 999) qty = 0
    // 庫存校驗
    if (target.Enable == 1 && qty > target.Amount * 1) {
      qty = target.Amount * 1
      commonStore.showMessage(
        `目前商品數量僅剩 ${target.Amount < 1 ? 0 : target.Amount} 組`,
        false
      )
    }

    // 動畫
    if (e) {
      let variation = qty - target.buyQty
      if (variation) flyHandler(main, variation, e)
    }

    // 更新 產品列表
    let product = productStore.products.find((product) => product.ID == main.ID)
    let productSpec
    if (spec) {
      productSpec = product.specArr.find(
        (productSpec) => productSpec.ID == spec.ID
      )
      productSpec.buyQty = qty
    } else product.buyQty = qty

    // 更新 購物車
    let mainTotalQty = cartStore.getMainTotalQty(product)
    let cartItemIndex = cartStore.cart
      .map((cartItem) => cartItem.ID)
      .indexOf(main.ID)
    // 購物車原本就有
    if (cartItemIndex > -1) {
      // 要放進購物車
      if (mainTotalQty) {
        let cartItem = cartStore.cart[cartItemIndex]
        if (productSpec) {
          cartItem.specArr.find(
            (cartSpec) => cartSpec.ID == productSpec.ID
          ).buyQty = productSpec.buyQty
        } else cartItem.buyQty = product.buyQty
      }
      // 不用放進購物車
      else {
        cartStore.cart.splice(cartItemIndex, 1)

        cartStore.setCart()
      }
    }
    // 購物車原本沒有
    else {
      // 要放進購物車
      if (mainTotalQty) cartStore.cart.push(JSON.parse(JSON.stringify(product)))
    }

    cartStore.setCart()

    // 更新加價購
    if (product.addProducts) {
      product.addProducts.forEach((addProduct, addProductIndex) => {
        if (addProduct.specArr) {
          addProduct.specArr.forEach((addProductSpec, addProductSpecIndex) => {
            if (addProductSpec.buyQty > mainTotalQty) {
              changeAddProductBuyQty(
                product,
                addProductIndex,
                addProductSpecIndex,
                mainTotalQty
              )
            }
          })
        } else {
          if (addProduct.buyQty > mainTotalQty) {
            changeAddProductBuyQty(product, addProductIndex, null, mainTotalQty)
          }
        }
      })
    }
  }
  // 改變 加價購數量
  async function changeAddProductBuyQty(main, addProductIndex, specIndex, qty) {
    let addProduct = main.addProducts[addProductIndex]
    let addProductSpec =
      specIndex == null ? null : addProduct.specArr[specIndex]
    let target = addProductSpec ? addProductSpec : addProduct

    // getAmount => update庫存, 檢查是否上架
    if (addProductSpec) {
      let isMarket = await getAmount(main, addProduct, target)
      if (!isMarket) {
        commonStore.showMessage("抱歉，您選購的規格已下架", false)
        await productStore.getProducts()
        productStore.productsHandler()
        return
      }
    } else {
      let isMarket = await getAmount(main, target)
      if (!isMarket) {
        commonStore.showMessage("抱歉，您選購的商品已下架", false)
        await productStore.getProducts()
        productStore.productsHandler()
        return
      }
    }

    // 基本校驗 非文字 or >999 => 0
    qty = useNumber(qty)
    if (qty > 999) qty = 0
    // 其他主商品下 此加價購商品的購買數量 總和
    let othersAddProductBuyQty = 0
    if (addProductSpec) {
      othersAddProductBuyQty = cartStore.getOthersAddProductQty(
        main.ID,
        addProduct,
        addProductSpec
      )
    } else {
      othersAddProductBuyQty = cartStore.getOthersAddProductQty(
        main.ID,
        addProduct
      )
    }
    // 庫存校驗
    if (target.Enable == 1) {
      if (qty + othersAddProductBuyQty > target.Amount * 1) {
        if (othersAddProductBuyQty == 0) qty = target.Amount * 1
        else {
          let leftBuyQty = target.Amount * 1 - othersAddProductBuyQty
          if (leftBuyQty <= 0) qty = 0
          else qty = leftBuyQty
        }
        commonStore.showMessage(
          `目前商品數量僅剩 ${target.Amount * 1 < 1 ? 0 : target.Amount} 組`,
          false
        )
      }
    }
    // 主商品總數量限制校驗
    let maxBuyQty = cartStore.getMainTotalQty(main)
    if (qty > maxBuyQty) qty = maxBuyQty

    // 更新 產品列表
    let product = productStore.products.find((product) => product.ID == main.ID)
    let productAddProduct = product.addProducts.find(
      (productAddProduct) => productAddProduct.ID == addProduct.ID
    )
    if (productAddProduct.specArr) {
      let productAddProductSpec = productAddProduct.specArr.find(
        (productAddProductSpec) => productAddProductSpec.ID == addProductSpec.ID
      )
      if (productAddProductSpec) productAddProductSpec.buyQty = qty
    } else productAddProduct.buyQty = qty

    // 更新 購物車
    let cartItem = cartStore.cart.find((cartItem) => cartItem.ID == main.ID)
    if (cartItem)
      cartItem.addProducts = JSON.parse(JSON.stringify(product.addProducts))

    cartStore.setCart()
  }

  // ---------------

  // 取得 庫存 type 1: 沒有規格主商品, 2: 沒有規格加價購, 3: 有規格主商品和加價購
  async function getAmount(main, addProduct, spec) {
    // 加價購商品 or 主商品
    let product = addProduct ? addProduct : main
    // 商品某規格 or 商品沒規格
    let target = spec ? spec : product

    let type
    if (spec) type = 3
    else if (addProduct) type = 2
    else type = 1

    let query = {
      type,
      id: target.ID
    }
    if (addProduct) query["pid"] = main.ID

    try {
      let res = JSON.parse(await getAmountApi(query))
      const isReqSuccess = commonStore.resHandler(res, getAmount, [
        main,
        addProduct,
        spec
      ])
      if (!isReqSuccess) return

      let { Enable, Amount } = res.data[0]
      target.Enable = Enable
      target.Amount = Amount
      return true
    } catch (error) {
      throw new Error(error)
    }
  }

  // 改變 主商品數量 動畫
  function flyHandler(product, variation, { pageX, pageY }) {
    // click position
    let clickPosition = {
      pageX,
      pageY
    }

    // cartIcon position
    let scrollTop = document.querySelector("html").scrollTop || 0
    let cartIcon = document.querySelector(".cartIcon")
    let cartIconPosition = {
      pageX: cartIcon.offsetLeft + 12.5,
      pageY: cartIcon.offsetTop + scrollTop + 12.5
    }

    // set start, end
    let start
    let end
    if (variation > 0) {
      start = clickPosition
      end = cartIconPosition
    } else {
      start = cartIconPosition
      end = clickPosition
    }

    // img, position
    flyItem = product
    flyImgTop = start.pageY
    flyImgLeft = start.pageX

    // 設定 interval times, moveX, moveY
    let intervalTimes = 50
    let moveX = (end.pageX - start.pageX) / intervalTimes
    let moveY = (end.pageY - start.pageY) / intervalTimes

    //
    if (variation < 0) {
      shrinkHandler()
    }
    let interval = setInterval(function () {
      intervalTimes -= 1

      flyImgTop.value += moveY
      flyImgLeft.value += moveX

      if (intervalTimes < 1) {
        clearInterval(interval)
        flyItem.value = null

        if (variation > 0) {
          shrinkHandler()
        }
      }
    }, 10)
  }
  function shrinkHandler() {
    isShrink.value = 1
    setTimeout(function () {
      isShrink.value = 0
    }, 200)
  }

  return {
    changeMainBuyQty,
    changeAddProductBuyQty,
    getAmount
  }
})
