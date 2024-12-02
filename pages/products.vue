<script setup>
import CategoryMenu from "@/components/pages/category/Menu.vue"
import Select from "@/components/select.vue"
import ProductItem from "~/components/productItem.vue"
import Pagination from "@/components/pagination.vue"
import Notice from "@/components/Notice.vue"

const productStore = useProductStore()

const search = ref("")
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

function filterCategoryProducts(categories) {
  let arr = []
  categories.forEach((category) => {
    if (category.products) arr = [...arr, ...category.products]
    else arr = [...arr, ...filterCategoryProducts(category.children)]
  })
  return arr
}
const filterProducts = computed(() => {
  let products = []
  if (productStore.category) {
    if (productStore.category.products)
      products = productStore.category.products
    else products = filterCategoryProducts(productStore.category.children)
  } else products = productStore.products

  let searchFilterProducts = products.filter(
    (p) => search.value == undefined || p.Name.indexOf(search.value) > -1
  )

  return searchFilterProducts
})

// search
onMounted(() => {
  search.value = useRoute().query.search
})

// perpageItemNumSelect => pagination.value.perpageItemNum
watch(
  () => perpageItemNumSelect.value.activeOption.number,
  () => {
    pagination.value.activePage = 1

    pagination.value.perpageItemNum =
      perpageItemNumSelect.value.activeOption.number
  },
  { immediate: true }
)

// filterProducts, pagination.value.perpageItemNum
watch(
  [filterProducts, () => pagination.value.perpageItemNum],
  () => {
    pagination.value.totalPageNum = Math.ceil(
      filterProducts.value.length / pagination.value.perpageItemNum
    )
  },
  { immediate: true }
)
</script>

<template>
  <div class="products">
    <div class="categories">
      <CategoryMenu :categories="productStore.categories" />
    </div>

    <div class="selectContainer">
      <input type="text" placeholder="請輸入產品名稱" v-model="search" />
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

    <Notice />
  </div>
</template>

<style lang="scss" scoped>
@include productList;

.products {
  position: relative;

  .categories {
    width: 1170px;
    padding: 10px 0;
    margin: 20px auto 0 auto;
    display: flex;
    justify-content: center;

    @include mw1200 {
      width: 970px;
    }
    @include mw992 {
      width: 750px;
    }
    @include mw767 {
      width: 95%;
    }
  }
}

.selectContainer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 40px;

  input {
    width: 150px;
    height: 40px;
    padding: 10px;
    border: none;
    outline: none;
    border-bottom: 1px solid #aaa;
  }
}
</style>
