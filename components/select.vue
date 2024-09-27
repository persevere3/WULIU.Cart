<script setup>
const props = defineProps({
  select: {
    type: Object,
    default: {
      options: [{ Name: "" }],
      activeOption: { Name: "" }
    }
  }
})
</script>

<template>
  <div class="c_select" v-if="select && select.activeOption">
    <div class="c_activeOption">
      {{ select.activeOption.Name }}
      <i class="fa fa-angle-down" aria-hidden="true"></i>
    </div>
    <div class="c_options">
      <ul>
        <li
          :class="{ active: option.Name === select.activeOption.Name }"
          v-for="(option, index) in select.options"
          :key="index"
          @click="select.activeOption = option"
        >
          {{ option.Name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/mixin/_ellipsis.scss";

.c_select {
  width: 150px;
  min-height: 35px;

  margin: 10px;

  font-size: 14px;
  color: #333;

  position: relative;
  cursor: pointer;

  &:hover {
    .c_activeOption {
      border-bottom: 1px solid #ddd;
    }
    .c_options {
      display: block;
    }
  }

  .c_activeOption {
    padding: 10px 20px 10px 10px;
    border-bottom: 1px solid #aaa;
    position: relative;
    @include single_ellipsis;

    i {
      position: absolute;
      top: 50%;
      right: 0%;
      transform: translateY(-50%);
    }
  }

  .c_options {
    position: absolute;
    top: 100%;
    left: 0;
    box-shadow: 0 0 1px 1px #ccc;
    background-color: #fff;
    z-index: 1;
    display: none;

    ul {
      li {
        width: 150px;
        min-height: 35px;
        padding: 10px 20px 10px 10px;

        &:hover,
        &.active {
          background: $primaryColor;
          color: #fff;
        }
      }
    }
  }
}
</style>
