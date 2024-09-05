<template>
  <div class="input_container" :class="{ error: input.is_error }">
    <!-- 日期 -->
    <template v-if="input.type === 'date'">
      <template v-if="input.originValue">
        <input type="text" readonly v-model.trim="input.originValue" />
      </template>

      <template v-else>
        <VueDatePicker
          :placeholder="input.placeholder"
          format="yyyy/MM/dd"
          :enable-time-picker="false"
          v-model="input.value"
          @closed="verify(input)"
          @cleared="verify(input)"
        >
        </VueDatePicker>
      </template>
    </template>

    <template v-else-if="input.type === 'copy'">
      <div class="copy_container">
        <input type="text" id="copy_input" readonly v-model="input.value" />
        <div class="copy" @click="useCopy(input.value, '#copy_input')">
          <i class="fas fa-copy"></i>
        </div>
      </div>
    </template>

    <!-- 一般 -->
    <template v-else>
      <input
        :type="
          input.type === 'password' && !input.visible ? 'password' : 'text'
        "
        :readonly="input.readonly"
        :placeholder="input.placeholder"
        autocomplete="false"
        v-model.trim="input.value"
        @blur="verify(input)"
      />
      <div
        v-if="input.type === 'password'"
        class="eyes_icon"
        @click.stop="input.visible = !input.visible"
      >
        <i class="fas fa-eye" v-if="input.visible"></i>
        <i class="fas fa-eye-slash" v-else></i>
      </div>
    </template>

    <div class="errorMessage">
      <i class="error_icon fas fa-exclamation-circle"></i>
      {{ input.message }}
    </div>
  </div>
</template>

<script setup>
import VueDatePicker from "@vuepic/vue-datepicker"
import "@vuepic/vue-datepicker/dist/main.css"

import { useVerify } from "@/composables/verify"
import { useCopy } from "@/composables/copy"
let { verify } = useVerify()

let { input } = defineProps(["input"])
</script>

<style lang="scss">
.input_container {
  margin-bottom: 10px;
  position: relative;

  .copy_container {
    display: flex;
    position: relative;

    .copy {
      width: 30px;
      height: 40px;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      font-size: $font_m;
      color: $primaryColor;
      opacity: 0.5;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }

  input {
    width: 100%;
    height: 40px;
    line-height: 40px;
    padding: 0px 30px 0 10px;
    margin-bottom: 5px;
    font-size: 16px;
    border-radius: 3px;
    border: 1px solid $secondColor_a;
    outline: none;
    color: $secondColor_3;
    transition: box-shadow 0.3s;
    box-sizing: border-box;

    &[readonly] {
      background: #eee;
      cursor: not-allowed;
    }
  }
  .eyes_icon {
    width: 30px;
    height: 40px;
    position: absolute;
    top: 0;
    right: 0;
    color: $primaryColor;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .errorMessage {
    padding: 0px 10px;
    font-size: 14px;
    color: $dangerColor;
    align-items: center;
    display: none;

    .error_icon {
      margin-right: 5px;
    }
  }

  &.error {
    input {
      border: 1px solid $dangerColor;
    }
    .errorMessage {
      display: flex;
    }
  }
}

// date
.dp__main {
  // input
  .dp__input {
    padding: 0px 30px 0 35px !important;
  }
  // today
  .dp__today {
    border: 1px solid transparent;
    background-color: lighten($primaryColor, 20%);
    color: $white;
  }
  // month year date active
  .dp__overlay_cell_active,
  .dp__active_date {
    background-color: $primaryColor;
    color: $white;
  }
  // cancel select
  .dp__action_button {
    border: none !important;
    background-color: $secondColor;
    color: $white !important;

    &:hover {
      background-color: $primaryColor;
    }
  }
}
</style>
