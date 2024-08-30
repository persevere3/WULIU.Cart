<template>
  <div class="form">
    <!-- recommender -->
    <RegisterInput :input="userStore.r_form.recommender" />

    <!-- name -->
    <RegisterInput :input="userStore.r_form.name" />

    <!-- sex -->
    <div class="radio_container">
      <div class="radio">
        <input
          type="radio"
          name="sex"
          id="male"
          value="male"
          v-model="userStore.r_form.sex"
        />
        <div class="circle" v-show="userStore.r_form.sex == 'male'"></div>
      </div>
      <label for="male"> 男 </label>
      <div class="radio">
        <input
          type="radio"
          name="sex"
          id="female"
          value="female"
          v-model="userStore.r_form.sex"
        />
        <div class="circle" v-show="userStore.r_form.sex == 'female'"></div>
      </div>
      <label for="female"> 女 </label>
    </div>

    <!-- birthday -->
    <RegisterInput :input="userStore.r_form.birthday" />

    <!-- mail -->
    <RegisterInput :input="userStore.r_form.mail" />
    <RegisterInput
      :input="userStore.r_form.mail_verify_code"
      v-if="
        commonStore.store.NotificationSystem == 0 ||
        commonStore.store.NotificationSystem == 2
      "
    />

    <!-- phone -->
    <RegisterInput :input="userStore.r_form.phone2" />
    <RegisterInput
      :input="userStore.r_form.phone_verify_code"
      v-if="
        commonStore.store.NotificationSystem == 1 ||
        commonStore.store.NotificationSystem == 2
      "
    />

    <!-- 驗證碼 -->
    <div class="button" style="margin-bottom: 20px" @click="send_verify_code">
      獲取驗證碼
      <span v-if="userStore.r_form.second > 0">
        ( {{ userStore.r_form.second }}s )
      </span>
    </div>

    <!-- 密碼 -->
    <RegisterInput :input="userStore.r_form.password" />
    <RegisterInput :input="userStore.r_form.confirm_password" />

    <!-- agree -->
    <div class="agree_container">
      <div class="checkbox">
        <input
          type="checkbox"
          name=""
          id="agree"
          v-model="userStore.r_form.is_agree"
        />
        <i class="fas fa-check" v-show="userStore.r_form.is_agree"></i>
      </div>
      <label for="agree"> 我已同意 </label>
      <div
        class="modal_text"
        @click="userStore.r_form.is_member_and_privacy = true"
      >
        會員條款與隱私權政策
      </div>
    </div>
  </div>

  <!-- 會員條款與隱私權政策 modal -->
  <div
    class="member_and_privacy_container"
    v-if="userStore.r_form.is_member_and_privacy"
  >
    <div class="close" @click="userStore.r_form.is_member_and_privacy = false">
      <i class="fas fa-times"></i>
    </div>
    <div class="modal">
      <div
        class="content"
        v-html="useUnescapeHTML(commonStore.site.TermsNotices)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import RegisterInput from "./RegisterInput.vue"

import { useUnescapeHTML } from "@/composables/unescapeHTML"

const commonStore = useCommonStore()
const userStore = useUserStore()
</script>

<style lang="scss" scoped>
@import "@/styles/mixin/_button.scss";

.form {
  width: calc(100% - 80px);
  z-index: 3;

  .radio_container {
    display: flex;
    margin-bottom: 15px;

    .radio {
      width: 20px;
      height: 20px;
      margin-right: 5px;
      position: relative;
      border-radius: 50%;
      border: 1px solid $secondColor_a;

      input {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 1;
        cursor: pointer;
      }

      .circle {
        width: 13px;
        height: 13px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: $primaryColor;
      }
    }

    label {
      margin-right: 15px;
      cursor: pointer;
    }
  }

  .agree_container {
    margin-bottom: 15px;
    font-size: 16px;
    display: flex;
    align-items: center;

    .checkbox {
      width: 20px;
      height: 20px;
      margin-right: 10px;
      position: relative;
      border-radius: 3px;
      border: 1px solid $secondColor_a;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      input[type="checkbox"] {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        z-index: 1;
        cursor: pointer;
      }
      i {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 1.5px;
        color: lighten($primaryColor, 10%);
      }
    }
    label {
      cursor: pointer;
    }
    .modal_text {
      margin-left: 5px;
      color: lighten($primaryColor, 10%);
      text-decoration: underline;
      opacity: 0.8;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }

  // 獲取驗證碼
  .button {
    @include button(auto, 40px, 0, 0, 3px, $primaryColor, $white, 14);
  }
}

.member_and_privacy_container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba($black, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2147483645;

  .close {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 30px;
    color: $white;
    opacity: 0.8;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .modal {
    width: 90%;
    max-height: 80%;
    overflow-y: auto;
    padding: 3%;
    border-radius: 5px;
    background: $white;
  }
}
</style>
