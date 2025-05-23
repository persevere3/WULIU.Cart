<script setup>
import Pagination2 from "~/components/pagination2.vue"

const commonStore = useCommonStore()
const orderStore = useOrderStore()
const memberInfoStore = useMemberInfoStore()
const purchaseInfoStore = usePurchaseInfoStore()

const { RtnMsg, account, result, phone, email } = useRoute().query
console.log(useRoute().query)

let getOrderHandler = computed(() => {
  console.log(commonStore.user_account)
  return commonStore.user_account
    ? orderStore.getMemberOrder
    : orderStore.getOrder
})

watch(
  () => orderStore.order_pagination.activePage,
  () => {
    getOrderHandler.value("page", true)
  }
)

watch(
  () => orderStore.order_pagination.perpageItemNum,
  () => {
    getOrderHandler.value("", true)
  }
)

onMounted(() => {
  // 付款成功
  if (RtnMsg) {
    commonStore.showMessage("已收到您的付款", true)
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
    },
    { immediate: true }
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
          <label> 配送狀態 </label>
          <select v-model="orderStore.filter_delivery">
            <option value="0">=== 配送狀態 ===</option>
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
            <div class="td transportState">配送狀態</div>
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
                      @click.stop="commonStore.isConfirmATM2 = true"
                    >
                      匯款帳戶
                    </div>
                  </div>
                  <div
                    class="button"
                    @click.stop="
                      ;(commonStore.isConfirmCheckPay = true),
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
                      orderStore.rePay(
                        item.FilNo,
                        `${item.PayType === '2' ? '' : useRoute().name}`
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
                      orderStore.rePay(
                        item.FilNo,
                        `${
                          item.PayType === '2'
                            ? ''
                            : useRoute().name + '?page=order'
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
              <div class="l_head">配送狀態</div>
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

      <Pagination2 :pagination="orderStore.order_pagination" />
    </div>
    <div class="box" v-if="orderStore.noOrder" style="text-align: center">
      查無訂單資料
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/pages/order.scss";
</style>
