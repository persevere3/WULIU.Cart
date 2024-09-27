<script setup>
const commonStore = useCommonStore()
const orderStore = useOrderStore()
const memberInfoStore = useMemberInfoStore()

const { RtnMsg, account, result, phone, email } = useRoute().query

let getOrderHandler = computed(() => {
  return commonStore.user_account
    ? orderStore.getMemberOrder
    : orderStore.getOrder
})

onMounted(() => {
  // 付款成功
  if (RtnMsg) {
    commonStore.showMessage("已收到您的付款", true)
  }

  // Line 登入
  if (account) {
    commonStore.user_account = account
  }
  // Line 綁定
  if (result) {
    result = JSON.parse(decodeURI(result))
    if (!result.status) commonStore.showMessage(result.msg, false)
    else commonStore.user_account = result.account
  }

  watch(
    () => commonStore.is_initial,
    async () => {
      if (commonStore.user_account) {
        await memberInfoStore.getMemberInfo()
        orderStore.getMemberOrder()
      } else {
        if (phone && email) {
          orderStore.search_phone = phone
          orderStore.search_mail = email
          orderStore.getOrder()
        }
      }
    }
  )

  useRouter().replace({ path: useRoute().name })
})
</script>

<template>
  <div class="order">
    <div class="box" v-if="!commonStore.user_account">
      <div class="info">
        <label> 訂單查詢 </label>
        <input
          type="text"
          placeholder="購買人手機號碼"
          v-model="orderStore.search_phone"
          @keyup.enter="getOrderHandler()"
        />
        <input
          type="text"
          placeholder="購買人電子信箱"
          v-model="orderStore.search_mail"
          @keyup.enter="getOrderHandler()"
        />
        <div class="button_row">
          <div class="button" @click="getOrderHandler()">搜尋</div>
        </div>
      </div>
    </div>

    <div class="box" v-if="orderStore.order">
      <div class="filter">
        <div class="item">
          <label> 訂單編號 </label>
          <input
            type="text"
            placeholder="訂單編號"
            v-model="orderStore.filter_number"
          />
        </div>

        <div class="item">
          <label> 付款狀態 </label>
          <select v-model="orderStore.filter_pay">
            <option value="0">=== 付款狀態 ===</option>
            <option
              :value="index"
              v-for="(item, index) in orderStore.payStatus_arr"
              :key="index"
              v-show="index != 0 && index != 5"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div class="item">
          <label> 運送狀態 </label>
          <select v-model="orderStore.filter_delivery">
            <option value="0">=== 運送狀態 ===</option>
            <option
              :value="index"
              v-for="(item, index) in orderStore.delivery_arr"
              :key="index"
              v-show="index != 0"
            >
              {{ item }}
            </option>
          </select>
        </div>

        <div class="button_row">
          <div class="button" @click="getOrderHandler('', true)">篩選</div>
        </div>
      </div>
    </div>

    <div
      :class="{ box: useRoute().name.indexOf('order') > -1 }"
      v-if="orderStore.order"
    >
      <div class="table">
        <div class="head">
          <div class="tr">
            <div class="td number">訂單編號</div>
            <div class="td products">商品</div>
            <div class="td amount">金額</div>
            <div class="td payState">付款狀態</div>
            <div class="td transportState">運送狀態</div>
            <div class="td time">成立時間</div>
          </div>
        </div>
        <div class="body">
          <div class="tr" v-for="item in orderStore.order" :key="item.FilNo">
            <div class="td number">
              {{ item.FilNo }}
            </div>

            <div
              class="td products"
              :class="{
                active: orderStore.active_order_products == item.FilNo,
                expandable: item.expandable
              }"
              @click="
                orderStore.active_order_products == item.FilNo
                  ? (orderStore.active_order_products = '')
                  : (orderStore.active_order_products = item.FilNo)
              "
            >
              <ul>
                <li
                  v-for="(item2, index) in item.Items"
                  :key="index"
                  v-show="
                    orderStore.active_order_products == item.FilNo || index < 4
                  "
                >
                  {{ item2.ProductType == 2 ? "加價購" : "" }} {{ item2.Name
                  }}{{ item2.Spec ? `(${item2.Spec})` : "" }} NT${{
                    useNumberThousands(item2.Price)
                  }}
                  x {{ item2.Amount }}
                </li>
              </ul>
              <template v-if="item.expandable">
                <div
                  class="icon"
                  v-if="orderStore.active_order_products == item.FilNo"
                >
                  <i class="fa-solid fa-chevron-up"></i>
                </div>
                <div class="icon" v-else>
                  <i class="fa-solid fa-chevron-down"></i>
                </div>
              </template>
            </div>

            <div class="td amount">
              <div class="total">
                應付金額: NT$ {{ useNumberThousands(item.TotalAmount) }}
              </div>
              <div class="additional">
                <div v-if="item.Shipping * 1">
                  運費: NT$ {{ useNumberThousands(item.Shipping) }}
                </div>
                <div v-if="item.Discount * 1">
                  折扣: NT$ {{ useNumberThousands(item.Discount) }}
                </div>
                <div
                  v-if="
                    item.DiscountCode && item.DiscountCode.split(' ')[0] * 1
                  "
                >
                  <div>
                    折扣碼優惠: NT$
                    {{ useNumberThousands(item.DiscountCode.split(" ")[0]) }}
                    {{ item.DiscountCode.split(" ")[1] }}
                  </div>
                </div>
                <div v-if="item.UsedWallet * 1">
                  <div>
                    使用購物金: NT$ {{ useNumberThousands(item.UsedWallet) }}
                  </div>
                </div>
              </div>
            </div>

            <div class="td payState">
              <div class="l_head">付款狀態</div>
              <!-- 付款方式 -->
              <template v-if="item.Mart">
                <div v-if="item.Mart.indexOf('Delivery') < 0" class="payMethod">
                  <div>{{ orderStore.payMethod_obj["MartOnDelivery"] }}</div>
                  <div>{{ orderStore.payMethod_obj[item.PayMethod] }}</div>
                </div>
                <div v-else class="payMethod">
                  {{ orderStore.payMethod_obj["MartPayOnDelivery"] }}
                </div>
              </template>
              <template v-else>
                <div class="payMethod">
                  {{ orderStore.payMethod_obj[item.PayMethod] }}
                </div>
              </template>

              <!-- 付款狀態 -->
              <div
                class="state_container"
                v-if="item.Delivery == 3 || item.Delivery == 4"
              >
                <div>{{ orderStore.payStatus_arr[item.PayStatus] }}</div>
              </div>
              <!-- PayStatus == 2 (待付款)，PayMethod == 'ATM'，PayType == 1 (公司) -->
              <div
                class="state_container"
                v-else-if="
                  item.PayStatus == 2 &&
                  item.PayMethod == 'ATM' &&
                  item.PayType == 1
                "
              >
                <template v-if="commonStore.store.SelfAtmStatus == 0">
                  <div>ATM帳戶關閉，請聯繫我們</div>
                </template>
                <template v-else>
                  <div class="show_bank">
                    <div
                      class="button"
                      @click.stop="
                        ;(commonStore.is_payModal = true),
                          (commonStore.payModal_message = 'template1')
                      "
                    >
                      匯款帳戶
                    </div>
                  </div>
                  <div
                    class="button"
                    @click.stop="
                      ;(commonStore.is_payModal = true),
                        (commonStore.payModal_message = 'template2'),
                        (orderStore.account_number = ''),
                        (orderStore.order_number = item.PayFilNo)
                    "
                  >
                    付款確認
                  </div>
                </template>
              </div>
              <div
                class="state_container"
                v-else-if="
                  item.PayStatus == 2 && item.PayMethod != 'PayOnDelivery'
                "
              >
                <div
                  class="button"
                  v-if="useRoute().name.toLowerCase().indexOf('order') > -1"
                  @click="
                    ;(purchaseInfoStore.pay_method = item.PayMethod),
                      rePay(
                        item.FilNo,
                        `${
                          item.PayType === '2' ? '' : location.origin + '/order'
                        }`
                      )
                  "
                >
                  立即付款
                </div>
                <div
                  class="button"
                  v-if="useRoute().name.toLowerCase().indexOf('info') > -1"
                  @click="
                    ;(purchaseInfoStore.pay_method = item.PayMethod),
                      rePay(
                        item.FilNo,
                        `${
                          item.PayType === '2'
                            ? ''
                            : location.origin + '/info' + '?page=order'
                        }`
                      )
                  "
                >
                  立即付款
                </div>
              </div>
              <div class="state_container" v-else>
                <div>{{ orderStore.payStatus_arr[item.PayStatus] }}</div>
              </div>
            </div>

            <div class="td transportState">
              <div class="l_head">運送狀態</div>
              <div class="text">
                <span> {{ orderStore.delivery_arr[item.Delivery] }} </span>
                <span
                  class="search"
                  v-if="
                    item.Mart &&
                    (item.Delivery === '1' || item.Delivery === '6')
                  "
                  @click="orderStore.searchMartDelivery(item)"
                >
                  查詢
                </span>
              </div>
              <template
                v-if="
                  item.CancelTime && (item.Delivery == 3 || item.Delivery == 4)
                "
              >
                <div>{{ item.CancelTime.split(" ")[0] }}</div>
                <div>{{ item.CancelTime.split(" ")[1] }}</div>
              </template>
              <template
                v-else-if="
                  item.DeliveryTime &&
                  (item.Delivery == 1 || item.Delivery == 5)
                "
              >
                <div>{{ item.DeliveryTime.split(" ")[0] }}</div>
                <div>{{ item.DeliveryTime.split(" ")[1] }}</div>
              </template>
            </div>

            <div class="td time">
              <div class="l_head">成立時間</div>
              <div>{{ item.CreateTime.split(" ")[0] }}</div>
              <div>{{ item.CreateTime.split(" ")[1] }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="page_container">
        <div class="page">
          <ul>
            <li
              :class="{ disabled: orderStore.order_page_index < 2 }"
              @click="
                orderStore.order_page_index > 1
                  ? orderStore.order_page_index--
                  : '',
                  getOrderHandler('page', true)
              "
            >
              <i class="fas fa-caret-left"></i>
            </li>
            <li
              v-show="
                orderStore.order_page_index > Math.floor(5 / 2) &&
                orderStore.order_page_index <
                  orderStore.order_page_number - Math.floor(5 / 2)
                  ? item >= orderStore.order_page_index - Math.floor(5 / 2) &&
                    item <= orderStore.order_page_index + Math.floor(5 / 2)
                  : orderStore.order_page_index <= 5
                  ? item <= 5
                  : item > orderStore.order_page_number - 5
              "
              :class="{ active: orderStore.order_page_index === item }"
              v-for="item in orderStore.order_page_number"
              :key="item"
              @click="
                ;(orderStore.order_page_index = item),
                  getOrderHandler('page', true)
              "
            >
              {{ item }}
            </li>
            <li
              :class="{
                disabled:
                  orderStore.order_page_index > orderStore.order_page_number - 1
              }"
              @click="
                orderStore.order_page_index < orderStore.order_page_number
                  ? orderStore.order_page_index++
                  : '',
                  getOrderHandler('page', true)
              "
            >
              <i class="fas fa-caret-right"></i>
            </li>
          </ul>
        </div>
        <div class="total">
          {{ orderStore.order_page_index }} / {{ orderStore.order_page_number }}
        </div>
        <div
          class="select"
          @click.stop="orderStore.select_active = !orderStore.select_active"
        >
          <div class="value">{{ orderStore.order_page_size }}</div>
          <i class="fas fa-caret-down"></i>
          <ul :class="{ active: orderStore.select_active }">
            <li
              :class="{ active: orderStore.order_page_size === item * 10 }"
              v-for="item in 5"
              :key="item"
              @click="
                ;(orderStore.order_page_size = item * 10),
                  getOrderHandler('', true)
              "
            >
              {{ item * 10 }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="box" v-if="orderStore.noOrder" style="text-align: center">
      查無訂單資料
    </div>
  </div>

  <div class="martDeliveryModal" v-if="orderStore.activeOrder">
    <div class="number_container" v-if="orderStore.activeOrder.deliveryNumber">
      <div class="number_title">
        {{
          orderStore.mart_obj[
            orderStore.activeOrder.Mart.replace("C2C", "").replace(
              "Delivery",
              ""
            )
          ]
        }}
        包裹查詢號碼
      </div>
      <input
        type="text"
        id="number_input"
        readonly
        v-model="orderStore.activeOrder.deliveryNumber"
      />
      <div
        class="copy"
        @click="useCopy(orderStore.activeOrder.deliveryNumber, '#number_input')"
      >
        <i class="fas fa-copy"></i>
      </div>
    </div>

    <div class="message">{{ orderStore.activeOrder.deliveryMsg }}</div>
    <div class="time"></div>
    <div class="button close" @click="orderStore.activeOrder = null">確認</div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/pages/order.scss";
</style>
