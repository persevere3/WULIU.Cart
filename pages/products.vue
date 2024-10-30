<script setup>
import Select from "@/components/select.vue"
import ProductItem from "~/components/productItem.vue"
import Pagination from "@/components/pagination.vue"
import Notice from "@/components/Notice.vue"

const commonStore = useCommonStore()
const productStore = useProductStore()

const search = ref("")
const categorySelect = ref({})
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
  let searchFilterProducts = productStore.products.filter(
    (p) => search.value == undefined || p.Name.indexOf(search.value) > -1
  )

  let filteredProducts = searchFilterProducts.filter(
    (p) =>
      categorySelect.value.activeOption?.ID == 0 ||
      p.categoryArr.includes(categorySelect.value.activeOption?.ID)
  )

  return filteredProducts
})

// search
onMounted(() => {
  search.value = useRoute().query.search
})

// categorySelect
watch(
  () => productStore.category_products,
  (v) => {
    if (Object.entries(v).length > 0) {
      categorySelect.value = {
        options: productStore.categories,
        activeOption: productStore.categories[0]
      }
    }
  },
  { immediate: true }
)
watch(
  () => categorySelect.value.activeOption,
  () => {
    pagination.value.activePage = 1
  },
  { immediate: true }
)

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
  <div>
    <div class="selectContainer">
      <input type="text" placeholder="請輸入產品名稱" v-model="search" />
      <Select v-if="categorySelect.options" :select="categorySelect" />
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
