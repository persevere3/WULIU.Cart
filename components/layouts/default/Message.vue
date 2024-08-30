<template>
  <div class="message_container">
    <div
      v-for="item in commonStore.messageArr"
      :key="item.id"
      class="message"
      :class="{
        messageActive: item.messageActive,
        messagefadeout: item.messagefadeout
      }"
      :style="`background:${
        item.isSuccess ? 'rgba(50, 200, 50, 0.6)' : 'rgba(255, 0, 0, 0.6)'
      }`"
    >
      {{ item.messageStr }}
    </div>
  </div>
</template>

<script setup>
const commonStore = useCommonStore()
</script>

<style lang="scss" scoped>
.message_container {
  .message {
    padding: 10px 30px;
    position: fixed;
    top: 30%;
    left: 0%;
    border-radius: 3px;
    color: $white;
    transition: top 3s, opacity 0.5s;
    z-index: 200;

    &.messageActive {
      top: 10%;

      &.messagefadeout {
        opacity: 0;
      }
    }
  }
}
</style>
