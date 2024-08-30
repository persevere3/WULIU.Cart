<template>
  <!-- 前往付款頁面 -->
  <div class="confirm" v-if="commonStore.isConfirmToPay">
    <div class="frame">
      <div class="border"></div>
      <div class="confirm_title">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
        <div class="text">已收到您的訂單！</div>
      </div>
      <div class="message">
        <template
          v-if="
            purchaseInfoStore.pay_method != 'PayOnDelivery' &&
            purchaseInfoStore.pay_method != 'MartPayOnDelivery'
          "
        >
          前往付款頁面
        </template>
      </div>
      <div class="buttonGroup">
        <div
          class="button determine"
          @click=";(commonStore.isConfirmToPay = false), orderStore.toPay()"
        >
          確定
        </div>
      </div>
    </div>
  </div>

  <!-- 已使用過折扣碼 -->
  <div class="confirm" v-if="commonStore.isConfirmDiscountCodeUsed">
    <div class="frame">
      <div class="border"></div>
      <div class="confirm_title">
        <i class="fa fa-question-circle" aria-hidden="true"></i>
      </div>
      <div class="message">
        您已使用過此折扣碼！請按取消後重新輸入
        <span v-if="!commonStore.user_account"> 手機或 </span>
        折扣碼，或按確定放棄優惠直接完成訂單
      </div>
      <div class="buttonGroup">
        <div
          class="button cancel"
          @click="commonStore.isConfirmDiscountCodeUsed = false"
        >
          取消
        </div>
        <div
          class="button determine"
          @click="orderStore.cancelDiscountCodeCreateOrder()"
        >
          確定
        </div>
      </div>
    </div>
  </div>

  <!-- ATM 匯款訊息 -->
  <div class="confirm" v-if="commonStore.isConfirmATM">
    <div class="frame">
      <div class="border"></div>

      <div class="confirm_title">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
      </div>
      <div class="message bank">
        <div class="bank_name">
          <label> 匯款銀行 : </label>
          {{ commonStore.store.SelfAtmBankId }}
          {{ commonStore.bank[commonStore.store.SelfAtmBankId] }}
        </div>
        <div class="bank_account">
          <label> 匯款帳號 : </label>
          <input
            type="text"
            class="copy_input"
            readonly
            v-model="commonStore.store.SelfAtmId"
          />
          <div
            class="copy"
            @click="useCopy(commonStore.store.SelfAtmId, '.copy_input')"
          >
            <i class="fas fa-copy"></i>
          </div>
        </div>
      </div>
      <div class="notice">
        <i class="fas fa-exclamation-circle"></i>
        請記得在匯款成功後前往
        <div
          class="a"
          @click="
            useUrlPush(
              `/order?phone=${purchaseInfoStore.info.purchaser_number.value}&email=${purchaseInfoStore.info.purchaser_email.value}`,
              true
            )
          "
        >
          訂單列表
        </div>
        輸入匯款帳戶末6碼，我們確認後將儘快為您安排出貨！
      </div>

      <div class="buttonGroup">
        <div class="button determine" @click="commonStore.isConfirmATM = false">
          確定
        </div>
      </div>
    </div>
  </div>

  <!-- 詢問是否註冊會員 -->
  <div class="confirm" v-if="commonStore.isConfirmIsRegister">
    <div class="frame">
      <div class="border"></div>
      <div class="confirm_title">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
      </div>
      <div class="message">是否可以耽擱您一點時間來加入我們會員？</div>
      <div class="buttonGroup">
        <div
          class="button cancel"
          @click="
            ;(commonStore.isConfirmIsRegister = false), orderStore.toPay()
          "
        >
          否
          <template
            v-if="
              purchaseInfoStore.pay_method != 'PayOnDelivery' &&
              purchaseInfoStore.pay_method != 'MartPayOnDelivery'
            "
          >
            ，前往付款頁面
          </template>
        </div>
        <div
          class="button determine"
          @click="
            ;(commonStore.isConfirmIsRegister = false),
              (commonStore.isConfirmRegister = true)
          "
        >
          是，請填寫註冊資料
        </div>
      </div>
    </div>
  </div>

  <!-- 註冊會員 -->
  <div class="confirm" v-if="commonStore.isConfirmRegister">
    <div class="frame">
      <div class="border"></div>
      <div class="confirm_title">
        <i class="fas fa-registered"></i>
        <div class="text">加入會員！</div>
      </div>

      <RegisterForm />

      <div class="buttonGroup">
        <div
          class="button cancel"
          @click=";(commonStore.isConfirmRegister = false), orderStore.toPay()"
        >
          <template
            v-if="
              purchaseInfoStore.pay_method != 'PayOnDelivery' &&
              purchaseInfoStore.pay_method != 'MartPayOnDelivery'
            "
          >
            前往付款頁面
          </template>
          <template v-else> 取消 </template>
        </div>
        <div
          class="button determine"
          :class="{ disabled: !userStore.r_form.is_agree }"
          @click="order_register"
        >
          註冊
        </div>
      </div>
    </div>
  </div>

  <div class="ECPay_form_container" v-html="orderStore.ECPay_form_value"></div>
  <div
    class="ECPay_form_container"
    v-html="orderStore.ECPay_store_form_value"
  ></div>
</template>

<script setup>
import RegisterForm from "@/components/registerForm/index.vue"

import { useCopy } from "@/composables/copy"
import { useUrlPush } from "@/composables/urlPush"

const commonStore = useCommonStore()
const purchaseInfoStore = usePurchaseInfoStore()
const orderStore = useOrderStore()
const userStore = useUserStore()

watch(
  () => commonStore.isConfirmRegister,
  (v) => {
    if (v) {
      userStore.r_form.name.value = purchaseInfoStore.info.purchaser_name.value
      userStore.r_form.phone.value =
        purchaseInfoStore.info.purchaser_number.value
      userStore.r_form.mail.value = purchaseInfoStore.info.purchaser_email.value
    }
  }
)

async function order_register() {
  const res = await userStore.register()
  if (res) {
    setTimeout(function () {
      isConfirmRegister.value = false
    }, 3000)
    toPay()
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/mixin/_button.scss";

.confirm {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0%;
  left: 0%;
  background: rgba($black, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  .frame {
    width: 500px;
    position: relative;
    border-radius: 5px;
    background: $white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .border {
      width: calc(100% - 20px);
      height: calc(100% - 20px);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      border: 1px solid lighten($primaryColor, 10%);
      z-index: 1;
    }

    .confirm_title {
      margin: 30px 0 20px 0;
      color: lighten($primaryColor, 10%);
      font-size: 24px;
      display: flex;
      align-items: center;

      .text {
        margin-left: 15px;
      }
    }
    .message {
      padding: 10px 30px;
      font-size: 18px;
      z-index: 2;

      &.bank {
        width: 100%;
        padding: 10px 50px;

        .bank_name,
        .bank_account {
          display: flex;
          flex-wrap: wrap;
          align-items: center;

          label {
            white-space: nowrap;
            margin-right: 5px;
          }
        }

        .bank_name {
          margin-bottom: 10px;
        }
        .bank_account {
          input {
            width: 150px;
            height: 30px;
            line-height: 30px;
            margin-top: 5px;
            margin-right: 5px;
            border: none;
            outline: none;
            font-size: 18px;

            &:focus {
              box-shadow: none;
            }
          }
          .copy {
            height: 32px;
            margin-top: 5px;
            font-size: 20px;
            color: lighten($primaryColor, 10%);
            display: flex;
            align-items: center;
            cursor: pointer;

            i {
              margin: 0;
            }
          }
        }
      }
    }
    .notice {
      width: 100%;
      padding: 20px 25px;
      text-align: center;
      font-size: 18px;
      color: $secondColor_3;
      z-index: 2;

      .a {
        color: $dangerColor;

        &:hover {
          color: darken($dangerColor, 20%);
        }
      }
    }
    .buttonGroup {
      width: 90%;
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      z-index: 2;

      // confirm
      .button {
        @include button(
          auto,
          auto,
          6px 10px,
          0,
          5px,
          $secondColor_3,
          $white,
          14
        );
        max-width: calc(50% - 15px);

        &.cancel {
          margin-right: 15px;
          background-color: $secondColor_3;
        }
        &.determine {
          background-color: $primaryColor;
        }
      }
    }
  }
}
@include m {
  .confirm {
    .frame {
      width: 400px;
    }
  }
}
@include s {
  .confirm {
    .frame {
      width: 300px;
    }
  }
}
</style>
