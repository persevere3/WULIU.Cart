<script setup>
import Select from "@/components/select.vue"
import ProductItem from "~/components/productItem.vue"
import Pagination from "@/components/pagination.vue"

const commonStore = useCommonStore()
const productStore = useProductStore()

const categorySelect = ref({})
const sortSelect = ref({
  options: [
    {
      Name: "商品排序"
    },
    {
      Name: "上架時間: 由新至舊"
    },
    {
      Name: "上架時間: 由舊至新"
    },
    {
      Name: "價格: 由高至低"
    },
    {
      Name: "價格: 由低至高"
    }
  ],
  activeOption: {
    Name: "商品排序"
  }
})
const perpageItemNumSelect = ref({
  options: [
    {
      Name: "每頁顯示 4 個",
      number: 4
    },
    {
      Name: "每頁顯示 8 個",
      number: 8
    },
    {
      Name: "每頁顯示 12 個",
      number: 12
    },
    {
      Name: "每頁顯示 16 個",
      number: 16
    },
    {
      Name: "每頁顯示 20 個",
      number: 20
    }
  ],
  activeOption: {
    Name: "每頁顯示 8 個",
    number: 8
  }
})

const pagination = ref({
  perpageItemNum: 8,
  totalPageNum: 0,
  activePage: 1
})

const filterProducts = computed(() => {
  if (categorySelect.value.activeOption?.ID == 0) {
    return productStore.products
  }

  let products = productStore.products.filter((p) =>
    p.categoryArr.includes(categorySelect.value.activeOption?.ID)
  )

  return products
})

watch(
  () => perpageItemNumSelect.value.activeOption.number,
  () => {
    pagination.value.activePage = 1

    pagination.value.perpageItemNum =
      perpageItemNumSelect.value.activeOption.number
  }
)

watch(
  [filterProducts, () => pagination.value.perpageItemNum],
  () => {
    pagination.value.totalPageNum = Math.ceil(
      filterProducts.value.length / pagination.value.perpageItemNum
    )
  },
  { immediate: true }
)

setTimeout(() => {
  categorySelect.value = {
    options: productStore.categories,
    activeOption: productStore.categories[0]
  }

  watch(
    () => categorySelect.value.activeOption,
    () => {
      pagination.value.activePage = 1
    }
  )
}, 3000)
</script>

<template>
  <div>
    <!-- 
      <div class="arrangement" v-if="pageFilterProducts.length !== 0">
        <ul>
          <li>排列方式</li>
          <li :class="{ active: arrangement == 0 }" @click="arrangement = 0">
            <i class="fa fa-th-large" aria-hidden="true"></i>
          </li>
          <li :class="{ active: arrangement == 1 }" @click="arrangement = 1">
            <i class="fa fa-th-list" aria-hidden="true"></i>
          </li>
        </ul>
      </div>
    -->

    <div class="selectContainer">
      <Select v-if="categorySelect.options" :select="categorySelect" />
      <!-- <Select :select="sortSelect" /> -->
      <Select :select="perpageItemNumSelect" />
    </div>

    <div class="productList">
      <ul>
        <li
          v-for="(item, index) in filterProducts"
          :key="item.ID"
          v-show="
            index >= (pagination.activePage - 1) * pagination.perpageItemNum &&
            index <= pagination.activePage * pagination.perpageItemNum - 1
          "
        >
          <ProductItem :product="item" />
        </li>
      </ul>
      <div
        class="noProduct"
        v-if="productStore.productsRendered && filterProducts.length === 0"
      >
        目前沒有銷售任何產品
      </div>
    </div>

    <div class="pages">
      <Pagination :pagination="pagination" />
    </div>

    <!-- <div class="notice">
      <ul>
        <li v-if="commonStore.store.Content" @click="showPage = 'Content'">
          訂購須知
        </li>
        <li
          v-if="commonStore.store.Description"
          @click="showPage = 'Description'"`
        >
          配送須知
        </li>
        <li
          v-if="commonStore.store.PrivacyPolicy"
          @click="showPage = 'PrivacyPolicy'"
        >
          隱私權聲明
        </li>
      </ul>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixin/_productList.scss";
@include productList;

.selectContainer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 40px;
}
</style>
