<script setup>
const commonStore = useCommonStore()
const cartStore = useCartStore()
const buyQtyHandlerStore = useBuyQtyHandlerStore()

// assignIndex: 指定的規格index
// 沒指定的話顯示Select => 商品列表
// 指定的話不會顯示Select => 購物車列表
let props = defineProps(["main", "addProduct", "assignIndex"])

// 主商品 or 加購商品
const product = computed(() => {
  return props.addProduct ? props.addProduct : props.main
})

const selectedSpec = computed(() => {
  if (props.assignIndex || props.assignIndex === 0) {
    return product.value.specArr[props.assignIndex]
  } else if (activeSpec.value.ID) {
    return activeSpec.value
  } else return null
})
const isSelect = computed(() => {
  if (!product.value.specArr || !selectedSpec.value?.ID) return false
  return selectedSpec.value.ID || selectedSpec.value?.ID === 0
})

// addProductIndex, specIndex => changeButQty
const addProductIndex = computed(() => {
  if (props.addProduct) {
    return props.main.addProducts
      .map((item) => item.ID)
      .indexOf(props.addProduct.ID)
  }
  return null
})
const specIndex = computed(() => {
  if (product.value.specArr) {
    if (props.assignIndex || props.assignIndex === 0) {
      return props.assignIndex
    }

    return product.value.specArr
      .map((item) => item.ID)
      .indexOf(selectedSpec.value.ID)
  }
  return null
})

const productSpecStatus = computed(() => {
  let target = product.value.specArr ? product.value.specArr : product.value

  // 停售中 -1
  if (commonStore.store?.Enable == 0) return -1
  // 暫無庫存 0
  if (isSelect && target.Enable == 1 && target.Amount == 0) return 0

  return 1
})

defineExpose({
  selectedSpec
})

let specArr = product.value.specArr
const activeSpec = ref({})
let activeSpecObj = ref({
  spec1: "",
  spec2: ""
})
let specObj = {}
let spec1Arr = []
let spec2Arr = []

const specNumber = ref(0)
let isSingleSpec = specArr.some((item) => !item.Name2)
specNumber.value = isSingleSpec ? 1 : 2

if (specArr) {
  specArr.forEach((item) => {
    // 雙規格
    if (specNumber.value === 2) {
      if (!specObj[item.Name]) specObj[item.Name] = {}
      specObj[item.Name][item.Name2] = item

      if (!specObj[item.Name2]) specObj[item.Name2] = {}
      specObj[item.Name2][item.Name] = item

      let spec1 = spec1Arr.find((spec) => spec === item.Name)
      if (!spec1) spec1Arr.push(item.Name)

      let spec2 = spec2Arr.find((spec) => spec === item.Name2)
      if (!spec2) spec2Arr.push(item.Name2)
    }
    // 單規格
    else {
      specObj[item.Name] = item

      let spec1 = spec1Arr.find((spec) => spec === item.Name)
      if (!spec1) spec1Arr.push(item.Name)
    }
  })
}

let showSpec1Arr = computed(() => {
  if (specNumber.value === 1) {
    return spec1Arr
  } else if (specNumber.value === 2) {
    if (!activeSpecObj.value.spec2) {
      return spec1Arr
    }

    let arr = []
    for (let key in specObj[activeSpecObj.value.spec2]) {
      arr.push(key)
    }
    return arr
  }
})
let showSpec2Arr = computed(() => {
  if (specNumber.value === 1) {
    return []
  } else if (specNumber.value === 2) {
    if (!activeSpecObj.value.spec1) {
      return spec2Arr
    }

    let arr = []
    for (let key in specObj[activeSpecObj.value.spec1]) {
      arr.push(key)
    }

    return arr
  }
})

function selectSpec(key, spec) {
  if (activeSpecObj.value[key] === spec) {
    activeSpecObj.value[key] = ""
  } else {
    activeSpecObj.value[key] = spec
  }

  // 單
  if (specNumber.value === 1) {
    if (activeSpecObj.value["spec1"]) {
      activeSpec.value = specObj[activeSpecObj.value["spec1"]]
    }
  }
  // 雙
  else if (specNumber.value === 2) {
    if (activeSpecObj.value["spec1"] && activeSpecObj.value["spec2"]) {
      activeSpec.value =
        specObj[activeSpecObj.value["spec1"]][activeSpecObj.value["spec2"]]
    }
  }
}
</script>

<template>
  <div class="ProductBuyQtyBox">
    <!-- 規格 -->
    <template v-if="assignIndex === undefined">
      <template v-if="product.specArr">
        <div class="specContainer">
          <div class="specTitle">{{ product.specArr[0].Title }}</div>
          <div class="specOptions">
            <div
              class="specOption"
              :class="{ active: spec === activeSpecObj.spec1 }"
              v-for="(spec, index) in showSpec1Arr"
              :key="spec"
              @click="selectSpec('spec1', spec)"
            >
              {{ spec }}
            </div>
          </div>
        </div>

        <div class="specContainer" v-if="showSpec2Arr.length">
          <div class="specTitle">{{ product.specArr[0].Title2 }}</div>
          <div class="specOptions">
            <div
              class="specOption"
              :class="{ active: spec === activeSpecObj.spec2 }"
              v-for="(spec, index) in showSpec2Arr"
              :key="spec"
              @click="selectSpec('spec2', spec)"
              v-show="spec"
            >
              {{ spec }}
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- 數量 -->
    <div class="discontinued" v-if="productSpecStatus === -1">停售中</div>
    <div class="discontinued" v-else-if="productSpecStatus === 0">暫無庫存</div>
    <div
      class="qtyBox"
      :class="{ noSelect: product.specArr && !isSelect }"
      v-else
    >
      <!-- 沒有規格 or 有規格且有選規格  -->
      <template v-if="!product.specArr || isSelect">
        <!-- 加購商品 -->
        <template v-if="addProduct && (addProduct.ID || addProduct.ID === 0)">
          <!-- 加購商品 規格 -->
          <template v-if="addProduct.specArr">
            <div
              class="reduce"
              :class="{
                qtyDisabled: selectedSpec.buyQty < 1
              }"
              @click="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  selectedSpec.buyQty - 1
                )
              "
            >
              <i class="fa fa-minus"></i>
            </div>
            <input
              class="number"
              type="text"
              size="3"
              maxlength="3"
              :disabled="cartStore.getMainTotalQty(main) < 1"
              v-model="selectedSpec.buyQty"
              @blur="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  selectedSpec.buyQty
                )
              "
              @keyup.enter="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  selectedSpec.buyQty
                )
              "
            />
            <div
              class="add"
              :class="{
                qtyDisabled:
                  selectedSpec.buyQty > cartStore.getMainTotalQty(main) - 1 ||
                  (selectedSpec.Enable == 1 &&
                    selectedSpec.buyQty > selectedSpec.Amount - 1) ||
                  selectedSpec.buyQty > 998
              }"
              @click="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  selectedSpec.buyQty + 1
                )
              "
            >
              <i class="fa fa-plus"></i>
            </div>
          </template>

          <!-- 加購商品 沒有規格 -->
          <template v-else>
            <div
              class="reduce"
              :class="{
                qtyDisabled: addProduct.buyQty < 1
              }"
              @click="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  addProduct.buyQty - 1
                )
              "
            >
              <i class="fa fa-minus"></i>
            </div>
            <input
              class="number"
              type="text"
              size="3"
              maxlength="3"
              :disabled="cartStore.getMainTotalQty(main) < 1"
              v-model="addProduct.buyQty"
              @blur="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  addProduct.buyQty
                )
              "
              @keyup.enter="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  addProduct.buyQty
                )
              "
            />
            <div
              class="add"
              :class="{
                qtyDisabled:
                  addProduct.buyQty > cartStore.getMainTotalQty(main) - 1 ||
                  (addProduct.Enable == 1 &&
                    addProduct.buyQty > addProduct.Amount - 1) ||
                  addProduct.buyQty > 998
              }"
              @click="
                buyQtyHandlerStore.changeAddProductBuyQty(
                  main,
                  addProductIndex,
                  specIndex,
                  addProduct.buyQty + 1
                )
              "
            >
              <i class="fa fa-plus"></i>
            </div>
          </template>
        </template>

        <!-- 主商品 -->
        <template v-else>
          <!-- 主商品 規格 -->
          <template v-if="main.specArr">
            <div
              class="reduce"
              :class="{ qtyDisabled: selectedSpec.buyQty < 1 }"
              @click="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  selectedSpec.buyQty - 1
                )
              "
            >
              <i class="fa fa-minus"></i>
            </div>
            <input
              class="number"
              type="text"
              size="3"
              maxlength="3"
              v-model="selectedSpec.buyQty"
              @blur="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  selectedSpec.buyQty
                )
              "
              @keyup.enter="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  selectedSpec.buyQty
                )
              "
            />
            <div
              class="add"
              :class="{
                qtyDisabled:
                  (selectedSpec.Enable == 1 &&
                    selectedSpec.buyQty > selectedSpec.Amount - 1) ||
                  selectedSpec.buyQty > 998
              }"
              @click="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  selectedSpec.buyQty + 1
                )
              "
            >
              <i class="fa fa-plus"></i>
            </div>
          </template>

          <!-- 主商品 沒有規格 -->
          <template v-else>
            <div
              class="reduce"
              :class="{ qtyDisabled: main.buyQty < 1 }"
              @click="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  main.buyQty - 1
                )
              "
            >
              <i class="fa fa-minus"></i>
            </div>
            <input
              class="number"
              type="text"
              size="3"
              maxlength="3"
              v-model="main.buyQty"
              @blur="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  main.buyQty
                )
              "
              @keyup.enter="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  main.buyQty
                )
              "
            />
            <div
              class="add"
              :class="{
                qtyDisabled:
                  (main.Enable == 1 && main.buyQty > main.Amount - 1) ||
                  main.buyQty > 998
              }"
              @click="
                buyQtyHandlerStore.changeMainBuyQty(
                  main,
                  specIndex,
                  main.buyQty + 1
                )
              "
            >
              <i class="fa fa-plus"></i>
            </div>
          </template>
        </template>
      </template>

      <!-- 有規格且沒選規格 -->
      <template v-else>
        <div class="reduce"><i class="fa fa-minus"></i></div>
        <input type="text" size="3" maxlength="3" class="number" disabled />
        <div class="add"><i class="fa fa-plus"></i></div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scope>
.ProductBuyQtyBox {
  // 規格
  .spec {
    width: 100%;
    margin-bottom: 5px;
  }
  .noSpec {
    height: 33px;
    margin-bottom: 5px;
  }

  //
  .select {
    width: 100%;
    height: 33px;
    padding: 0px 20px 0px 5px;
    margin-top: 5px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid $secondColor_a;
    outline: none;
    position: relative;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0px 0px 3px 1px $primaryColor;
    }

    &.selectError {
      border: 1px solid $dangerColor;

      &:focus {
        box-shadow: 0px 0px 3px 1px $dangerColor;
      }
    }

    .text {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .icon {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      transition: 0.3s;

      &.iconActive {
        transform: translateY(-50%) rotate(180deg);
      }
    }

    .option {
      width: 102%;
      max-height: 165px;
      overflow-y: auto;
      position: absolute;
      left: -1%;
      top: 110%;
      border-radius: 5px;
      border: 1px solid $primaryColor;
      background-color: $white;
      display: none;
      z-index: 5;

      &.showOption {
        display: block;
      }

      li {
        width: 100%;
        padding: 5px;
        margin-bottom: 0;
        text-align: left;
        word-break: break-all;
        border: 1px solid $secondColor_a;
        border-top: none;

        &:first-child {
          border-top: 1px solid $secondColor_a;
          border-radius: 5px 5px 0px 0px;
        }
        &:last-child {
          border-radius: 0px 0px 5px 5px;
        }

        &:hover {
          background: $primaryGradient;
        }
      }
    }
  }

  //
  .qtyBox {
    width: 100%;
    margin-bottom: 5px;
    display: flex;

    &.noSelect {
      opacity: 0.5;

      .reduce,
      .add {
        transition: 0s;
        cursor: default;

        &:hover {
          background-color: $white;
          i {
            color: $secondColor;
          }
        }

        i {
          transition: 0s;
        }
      }
      .number {
        cursor: default;
      }
    }

    .reduce,
    .add {
      padding: 3px 6px;
      border: 1px solid $secondColor;
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        background-color: $secondColor;

        i {
          color: $white;
        }
      }

      i {
        color: $secondColor;
        transition: 0.3s;
      }
    }
    .reduce {
      border-radius: 5px 0px 0px 5px;
      border-right: 1px solid transparent;
    }
    .add {
      border-radius: 0px 5px 5px 0px;
      border-left: 1px solid transparent;
    }

    .number {
      width: 100%;
      min-width: 0;
      height: 33px;
      padding: 0px 5px 0px 5px;
      text-align: center;
      font-size: 16px;
      border: 1px solid $secondColor;
      cursor: pointer;
    }
    .qtyDisabled {
      opacity: 0.3;
    }
  }
  // 停售 無庫存
  .discontinued {
    height: 33px;
    line-height: 33px;
    color: $dangerColor;
  }

  .specContainer {
    margin: 10px 0;
    display: flex;
    align-items: center;

    .specTitle {
      margin-right: 10px;
    }
    .specOptions {
      display: flex;
      justify-content: center;
      align-items: center;

      .specOption {
        @include border_button(
          auto,
          auto,
          6px 10px,
          0 5px,
          3px,
          $secondColor_3,
          $secondColor_3,
          $white,
          14
        );
      }
    }
  }
}
</style>
