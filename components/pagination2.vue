<script setup>
const props = defineProps({
  pagination: {
    type: Object,
    default: {
      perpageItemNum: 10,
      totalPageNum: 0,
      activePage: 1,
      is_show_options: false,
      options_arr: [10, 20, 30, 40, 50]
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
  <div class="page_container">
    <div class="page">
      <ul>
        <li
          :class="{ disabled: pagination.activePage < 2 }"
          @click="pagePush(pagination.activePage - 1)"
        >
          <i class="fas fa-caret-left"></i>
        </li>
        <li
          v-for="item in pagination.totalPageNum"
          :key="item"
          v-show="isShow(item)"
          :class="{ active: pagination.activePage == item }"
          @click="pagePush(item)"
        >
          {{ item }}
        </li>
        <li
          :class="{
            disabled: pagination.activePage > pagination.totalPageNum - 1
          }"
          @click="pagePush(pagination.activePage + 1)"
        >
          <i class="fas fa-caret-right"></i>
        </li>
      </ul>
    </div>

    <div class="total">
      {{ pagination.activePage }} /
      {{ pagination.totalPageNum }}
    </div>

    <div
      class="select"
      @click.stop="pagination.is_show_options = !pagination.is_show_options"
    >
      <div class="value">{{ pagination.perpageItemNum }}</div>
      <i class="fas fa-caret-down"></i>
      <ul :class="{ active: pagination.is_show_options }">
        <li
          :class="{ active: pagination.perpageItemNum === item }"
          v-for="item in pagination.options_arr"
          :key="item"
          @click="pagination.perpageItemNum = item"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page_container {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;

  .page {
    ul {
      display: flex;

      li {
        width: 33px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        border: 1px solid #333;
        border-right: none;
        background: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:first-child {
          border-radius: 5px 0 0 5px;
        }
        &:last-child {
          border-right: 1px solid #333;
          border-radius: 0 5px 5px 0;
        }

        &:hover,
        &.active {
          background-color: #333;
          color: #fff;
        }
        &.disabled {
          background-color: #fff;
          color: #000;
          opacity: 0.4;
        }
        i {
          font-size: 24px;
        }
      }
    }
  }

  .total {
    height: 35px;
    line-height: 35px;
    padding: 0px 5px;
  }

  .select {
    margin-left: 10px;
    background-color: #fff;
    position: relative;
    cursor: pointer;

    .value {
      width: 70px;
      height: 35px;
      line-height: 35px;
      padding-left: 15px;
      border-radius: 5px;
      border: 1px solid #333;
    }
    i {
      height: 35px;
      width: 35px;
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ul {
      width: 100%;
      position: absolute;
      bottom: 0px;
      left: 0;
      transform: translateY(100%);
      z-index: 10;
      display: none;

      &.active {
        display: block;
      }

      li {
        height: 35px;
        line-height: 35px;
        padding-left: 15px;
        background-color: #fff;
        border: 1px solid #333;
        border-top: none;

        &:first-child {
          border-radius: 5px 5px 0 0;
        }
        &:last-child {
          border-radius: 0 0 5px 5px;
        }

        &:hover,
        &.active {
          background-color: #333;
          color: #fff;
        }
      }
    }
  }

  @include mw767 {
    flex-wrap: wrap;

    .page {
      margin-bottom: 10px;
    }
  }
}
</style>
