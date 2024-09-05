<script setup>
import Order from "@/components/pages/order/index.vue"
import c_input from "@/components/registerForm/Input.vue"

const commonStore = useCommonStore()
const memberInfoStore = useMemberInfoStore()
const orderStore = useOrderStore()
const userStore = useUserStore()
const purchaseInfoStore = usePurchaseInfoStore()

const isDevelopment = process.env.NODE_ENV === "development" ? true : false

// delete r_mail.value.rules["required"]
// delete r_phone2.value.rules["required"]

const { RtnMsg, page } = useRoute().query

watch(
  () => commonStore.is_initial,
  async () => {
    await memberInfoStore.getMemberInfo()

    if (RtnMsg) {
      commonStore.showMessage("已收到您的付款", true)
    }
    if (page === "order") {
      memberInfoStore.member_info_nav_active = "order"
      orderStore.getMemberOrder()
    }

    // useRouter().replace({ path: "/info" })
  }
)
</script>

<template>
  <div class="info" v-if="commonStore.user_account">
    <div class="logout_container button_row">
      <template v-if="isDevelopment && memberInfoStore.memberInfo">
        <div
          class="button"
          v-if="memberInfoStore.memberInfo.Registermethod == 2"
          @click="memberInfoStore.deleteAccount_test"
          style="margin-right: 5px"
        >
          刪除Line帳號(測試用)
        </div>
        <div
          class="button"
          v-if="
            memberInfoStore.memberInfo.Registermethod <= 1 &&
            memberInfoStore.memberInfo.ConnectLine
          "
          @click="memberInfoStore.unbindLine_test"
          style="margin-right: 5px"
        >
          解除Line綁定(測試用)
        </div>
      </template>

      <div
        class="button"
        v-if="
          memberInfoStore.memberInfo &&
          memberInfoStore.memberInfo.Registermethod <= 1 &&
          !memberInfoStore.memberInfo.ConnectLine
        "
        @click="memberInfoStore.bindLine"
        style="margin-right: 5px"
      >
        綁定Line帳號
      </div>
      <div class="button" @click="memberInfoStore.post_logout">登出</div>
    </div>

    <div class="navs">
      <div
        class="nav"
        :class="{ active: memberInfoStore.member_info_nav_active === 'info' }"
        @click="
          ;(memberInfoStore.member_info_nav_active = 'info'),
            memberInfoStore.getMemberInfo()
        "
      >
        個人資訊
      </div>
      <div
        class="nav bonus_nav"
        :class="{ active: memberInfoStore.member_info_nav_active === 'bonus' }"
        @click="
          ;(memberInfoStore.member_info_nav_active = 'bonus'),
            memberInfoStore.getBonus()
        "
      >
        購物金紀錄
      </div>
      <div
        class="nav order_nav"
        :class="{ active: memberInfoStore.member_info_nav_active === 'order' }"
        @click="
          ;(memberInfoStore.member_info_nav_active = 'order'),
            orderStore.getMemberOrder()
        "
      >
        訂單列表
      </div>
    </div>
    <form class="forms">
      <div
        class="form"
        v-show="memberInfoStore.member_info_nav_active == 'info'"
      >
        <div class="title top">
          <i class="fas fa-edit"></i>
          編輯個人資訊
        </div>

        <div class="left">
          <div class="title">姓名</div>
          <c_input :input="memberInfoStore.e_form.name" />

          <div class="title">手機</div>
          <c_input :input="memberInfoStore.e_form.phone2" />

          <!-- 手機驗證碼 -->
          <template v-if="!memberInfoStore.memberInfo.Phone2">
            <div class="title">手機驗證碼</div>
            <c_input :input="memberInfoStore.e_form.phone_verify_code" />

            <div
              class="button"
              style="margin-bottom: 20px"
              @click="userStore.send_verify_code(memberInfoStore.e_form)"
            >
              獲取驗證碼
              <span v-if="memberInfoStore.e_form.second > 0">
                ( {{ memberInfoStore.e_form.second }}s )
              </span>
            </div>
          </template>

          <div class="title">電子信箱</div>
          <c_input :input="memberInfoStore.e_form.phone2" />

          <div
            class="password_container"
            v-if="memberInfoStore.memberInfo.Registermethod != 2"
          >
            <div class="title">密碼</div>
            <div
              class="button"
              @click="
                ;(commonStore.is_payModal = true),
                  (commonStore.payModal_message = 'template3')
              "
            >
              修改密碼
            </div>
          </div>

          <div class="title">生日</div>
          <c_input :input="memberInfoStore.e_form.birthday" />

          <div class="radio_container">
            <div class="title">性別</div>
            <div class="radio">
              <input
                type="radio"
                name="sex"
                id="male"
                value="male"
                v-model="memberInfoStore.e_form.sex"
              />
              <div
                class="circle"
                v-show="memberInfoStore.e_form.sex == 'male'"
              ></div>
            </div>
            <label for="male"> 男 </label>
            <div class="radio">
              <input
                type="radio"
                name="sex"
                id="female"
                value="female"
                v-model="memberInfoStore.e_form.sex"
              />
              <div
                class="circle"
                v-show="memberInfoStore.e_form.sex == 'female'"
              ></div>
            </div>
            <label for="female"> 女 </label>
          </div>

          <div class="title">推薦人代碼</div>
          <c_input :input="memberInfoStore.e_form.recommender" />

          <div class="title">推薦代碼</div>
          <c_input :input="memberInfoStore.e_form.recommend_code" />
        </div>

        <div class="right">
          <div class="title">
            常用收件地址
            <div
              class="add_address"
              @click="memberInfoStore.add_address"
              v-if="
                memberInfoStore.e_form.delivery_address &&
                memberInfoStore.e_form.delivery_address.length < 3
              "
            >
              <i class="fas fa-plus-circle"></i>
            </div>
          </div>
          <div
            class="address_container"
            :class="{ error: item.is_error }"
            v-for="(item, index) in memberInfoStore.e_form.delivery_address"
            :key="index"
          >
            <div class="address">
              <div
                class="select"
                @click.stop="
                  memberInfoStore.e_form.address_select_active ==
                  `${item.id}_city`
                    ? (memberInfoStore.e_form.address_select_active = '')
                    : (memberInfoStore.e_form.address_select_active = `${item.id}_city`)
                "
              >
                <div class="value">{{ item.city }}</div>
                <div class="dropdown"><i class="fas fa-caret-down"></i></div>
                <ul
                  :class="{
                    active:
                      memberInfoStore.e_form.address_select_active ==
                      `${item.id}_city`
                  }"
                >
                  <li
                    v-for="(value, city) in purchaseInfoStore.city_district"
                    :key="city"
                    @click=";(item.city = city), (item.district = '')"
                  >
                    {{ city }}
                  </li>
                </ul>
              </div>
              <div
                class="select"
                @click.stop="
                  memberInfoStore.e_form.address_select_active ==
                  `${item.id}_district`
                    ? (memberInfoStore.e_form.address_select_active = '')
                    : (memberInfoStore.e_form.address_select_active = `${item.id}_district`)
                "
              >
                <div class="value">{{ item.district }}</div>
                <div class="dropdown"><i class="fas fa-caret-down"></i></div>
                <ul
                  :class="{
                    active:
                      memberInfoStore.e_form.address_select_active ==
                      `${item.id}_district`
                  }"
                >
                  <li
                    v-for="(value, district) in purchaseInfoStore.city_district[
                      item.city
                    ]"
                    :key="district"
                    @click="item.district = district"
                  >
                    {{ district }}
                  </li>
                </ul>
              </div>
              <div class="input_container">
                <input
                  type="text"
                  placeholder="請輸入詳細地址"
                  v-model.trim="item.detail"
                />
                <div class="error message" v-if="item.message">
                  <i class="error_icon fas fa-exclamation-circle"></i>
                  {{ item.message }}
                </div>
              </div>
            </div>
            <div
              class="delete"
              @click="memberInfoStore.delete_address(item.id)"
            >
              <i class="fas fa-trash-alt"></i>
            </div>
          </div>

          <div class="title">手機條碼載具</div>
          <c_input :input="memberInfoStore.e_form.phone_barCode" />

          <div class="title">自然人憑證載具</div>
          <c_input :input="memberInfoStore.e_form.natural_barCode" />

          <div class="title">公司抬頭</div>
          <c_input :input="memberInfoStore.e_form.invoice_title" />

          <div class="title">統一編號</div>
          <c_input :input="memberInfoStore.e_form.invoice_uniNumber" />
        </div>

        <div class="button_row">
          <div class="button" @click="memberInfoStore.edit_info">儲存變更</div>
        </div>
      </div>

      <div
        class="form"
        v-show="memberInfoStore.member_info_nav_active == 'bonus'"
      >
        <div class="title top">
          <i class="fas fa-wallet"></i>
          現有購物金:
          <span class="current_bonus">
            {{ memberInfoStore.memberInfo.total_bonus }}
          </span>
        </div>

        <div class="table">
          <div class="head">
            <div class="tr">
              <div class="td date">日期</div>
              <div class="td bonus_type">購物金項目</div>
              <div class="td bonus">購物金</div>
            </div>
          </div>
          <div class="body">
            <div
              class="tr"
              v-for="(item, index) in memberInfoStore.bonus"
              :key="index"
            >
              <div class="td date">
                <div>
                  {{ item.Time.split(" ")[0] }} {{ item.Time.split(" ")[1] }}
                </div>
                <div>{{ item.Time.split(" ")[2] }}</div>
              </div>
              <div class="td bonus_type">
                {{ item.Type }}
              </div>
              <div
                class="td bonus"
                :class="item.FeedBack > 0 ? 'green' : 'red'"
              >
                {{ item.FeedBack > 0 ? "+" : "" }}{{ item.FeedBack }}
              </div>
            </div>
          </div>
        </div>

        <div class="page_container">
          <div class="page">
            <ul memberInfoStore.bonus_page_number>
              <li
                :class="{ disabled: memberInfoStore.bonus_page_index < 2 }"
                @click="
                  memberInfoStore.bonus_page_index > 1
                    ? memberInfoStore.bonus_page_index--
                    : '',
                    memberInfoStore.getBonus('page')
                "
              >
                <i class="fas fa-caret-left"></i>
              </li>
              <li
                v-show="
                  memberInfoStore.bonus_page_index > Math.floor(5 / 2) &&
                  memberInfoStore.bonus_page_index <
                    memberInfoStore.bonus_page_number - Math.floor(5 / 2)
                    ? item >=
                        memberInfoStore.bonus_page_index - Math.floor(5 / 2) &&
                      item <=
                        memberInfoStore.bonus_page_index + Math.floor(5 / 2)
                    : memberInfoStore.bonus_page_index <= 5
                    ? item <= 5
                    : item > memberInfoStore.bonus_page_number - 5
                "
                :class="{ active: memberInfoStore.bonus_page_index === item }"
                v-for="item in memberInfoStore.bonus_page_number"
                :key="item"
                @click="
                  ;(memberInfoStore.bonus_page_index = item),
                    memberInfoStore.getBonus('page')
                "
              >
                {{ item }}
              </li>
              <li
                :class="{
                  disabled:
                    memberInfoStore.bonus_page_index >
                    memberInfoStore.bonus_page_number - 1
                }"
                @click="
                  memberInfoStore.bonus_page_index <
                  memberInfoStore.bonus_page_number
                    ? memberInfoStore.bonus_page_index++
                    : '',
                    memberInfoStore.getBonus('page')
                "
              >
                <i class="fas fa-caret-right"></i>
              </li>
            </ul>
          </div>
          <div class="total">
            {{ memberInfoStore.bonus_page_index }} /
            {{ memberInfoStore.bonus_page_number }}
          </div>
          <div
            class="select"
            @click.stop="
              memberInfoStore.select_active = !memberInfoStore.select_active
            "
          >
            <div class="value">{{ memberInfoStore.bonus_page_size }}</div>
            <i class="fas fa-caret-down"></i>
            <ul :class="{ active: memberInfoStore.select_active }">
              <li
                :class="{
                  active: memberInfoStore.order_page_size === item * 10
                }"
                v-for="item in 5"
                :key="item"
                @click="
                  ;(memberInfoStore.bonus_page_size = item * 10),
                    memberInfoStore.getBonus()
                "
              >
                {{ item * 10 }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        class="form"
        v-if="memberInfoStore.member_info_nav_active == 'order'"
      >
        <Order />
      </div>
    </form>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/components/info.scss";
</style>
