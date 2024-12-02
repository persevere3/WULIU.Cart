<script setup>
const productStore = useProductStore()

const props = defineProps({
  categories: {
    type: Array,
    default: []
  }
})
</script>

<template>
  <div class="c_menu">
    <ul>
      <li v-for="item in categories" :key="item.ID">
        <div
          class="c_name"
          :class="{
            active: item.ID === productStore.category.ID,
            layer0: item.layer === 0
          }"
          @click="
            productStore.category.ID === item.ID
              ? (productStore.category = '')
              : (productStore.category = item)
          "
        >
          {{ item.Name }}
        </div>

        <template v-if="item.children">
          <div class="c_children">
            <Menu :categories="item.children" />
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.c_menu {
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      flex-shrink: 0;

      .c_name {
        padding: 5px 10px;
        margin: 5px 10px;
        border-radius: 5px 5px 0 0;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: center;
        cursor: pointer;

        &.layer0 {
          background-color: #ddd;
          border-bottom: 1px solid #ddd;
        }

        &:hover {
          background-color: #999;
          color: #fff;
        }

        &.active {
          background-color: $primaryColor;
          color: #fff;
        }
      }
    }
  }
}
</style>
