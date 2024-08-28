<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    default: {
      perpageItemNum: 9,
      totalPageNum: 10,
      activePage: 1
    }
  }
})

const showPageNum = ref(5)

function isShow(page) {
  if (props.pagination.totalPageNum <= showPageNum.value) {
    return page <= props.pagination.totalPageNum
  } else if (props.pagination.activePage < showPageNum.value / 2) {
    return page <= showPageNum.value
  } else if (
    props.pagination.activePage >
    props.pagination.totalPageNum - showPageNum.value / 2
  ) {
    return page > props.pagination.totalPageNum - showPageNum.value
  } else {
    return (
      page >= props.pagination.activePage - 2 &&
      page <= props.pagination.activePage + 2
    )
  }
}
function pagePush(page) {
  if (
    page > props.pagination.totalPageNum ||
    page < 1 ||
    page == props.pagination.activePage
  )
    return
  props.pagination.activePage = page
}
</script>

<template>
  <div class="c_pagination">
    <ul>
      <li :class="{ disabled: pagination.activePage < 2 }" @click="pagePush(1)">
        <i class="fa fa-angle-double-left" aria-hidden="true"></i>
      </li>
      <li
        :class="{ disabled: pagination.activePage < 2 }"
        @click="pagePush(pagination.activePage - 1)"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </li>
      <li
        v-for="page in pagination.totalPageNum"
        v-show="isShow(page)"
        :class="{ active: pagination.activePage == page }"
        @click="pagePush(page)"
      >
        {{ page }}
      </li>
      <li
        :class="{
          disabled: pagination.activePage > pagination.totalPageNum - 1
        }"
        @click="pagePush(pagination.activePage + 1)"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </li>
      <li
        :class="{ disabled: pagination.activePage == pagination.totalPageNum }"
        @click="pagePush(pagination.totalPageNum)"
      >
        <i class="fa fa-angle-double-right" aria-hidden="true"></i>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.c_pagination {
  padding: 15px;
  display: flex;
  justify-content: center;

  ul {
    display: flex;

    li {
      width: 40px;
      aspect-ratio: 1/1;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      &.disabled {
        opacity: 0.2;
      }

      &:hover {
        background-color: lighten($primaryColor, 40%);
        color: #fff;
      }

      &.active {
        background-color: $primaryColor;
        color: #fff;
      }
    }
  }
}
</style>
