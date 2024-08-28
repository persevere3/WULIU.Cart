<template>
  <div
    class="search_container"
    :class="{ active: defaultLayoutStore.is_search }"
    @click="defaultLayoutStore.close_search"
  >
    <div class="search" @click.stop="">
      <i
        class="fa fa-search"
        aria-hidden="true"
        @click="defaultLayoutStore.searchHandler"
      ></i>
      <input
        type="text"
        maxlength="100"
        placeholder="找商品"
        v-model="defaultLayoutStore.searchStr"
        @keyup.enter="defaultLayoutStore.searchHandler"
      />
    </div>
  </div>
</template>

<script setup>
const defaultLayoutStore = useDefaultLayoutStore()
</script>
