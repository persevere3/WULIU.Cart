<template>
  <div class="stepTwo">
    <div class="title">填寫購買人資訊</div>
    <form class="info">
      <div class="left">
        <label for="email">購買人Email</label>
        <input
          type="text"
          id="email"
          placeholder="購買人Email"
          :readonly="
            commonStore.user_account &&
            memberInfoStore.memberInfo.Registermethod == 2
              ? false
              : memberInfoStore.memberInfo.Email
          "
          :class="{
            inputError: purchaseInfoStore.info.purchaser_email.is_error
          }"
          v-model="purchaseInfoStore.info.purchaser_email.value"
          @blur="verify(purchaseInfoStore.info.purchaser_email)"
        />
        <div class="errorMessage">
          {{ purchaseInfoStore.info.purchaser_email.message }}
        </div>

        <label for="name">購買人姓名</label>
        <input
          type="text"
          id="name"
          placeholder="姓名"
          :readonly="memberInfoStore.memberInfo.Registermethod < 2"
          :class="{
            inputError: purchaseInfoStore.info.purchaser_name.is_error
          }"
          v-model="purchaseInfoStore.info.purchaser_name.value"
          @blur="verify(purchaseInfoStore.info.purchaser_name)"
          @change="input_purchaser"
        />
        <div class="errorMessage">
          {{ purchaseInfoStore.info.purchaser_name.message }}
          <span
            v-if="
              commonStore.user_account &&
              purchaseInfoStore.info.purchaser_name.is_error
            "
            @click="useUrlPush('/info')"
          >
            前往修改會員姓名
          </span>
        </div>

        <label for="phone">購買人手機號碼</label>
        <input
          type="text"
          id="phone"
          placeholder="購買人手機號碼"
          :readonly="memberInfoStore.memberInfo.Phone2"
          :class="{
            inputError: purchaseInfoStore.info.purchaser_phone.is_error
          }"
          v-model="purchaseInfoStore.info.purchaser_phone.value"
          @blur="verify(purchaseInfoStore.info.purchaser_phone)"
          @change="input_purchaser"
        />
        <div class="errorMessage">
          {{ purchaseInfoStore.info.purchaser_phone.message }}
        </div>

        <div class="custom_option isSame" @click="isSame = !isSame">
          <label>收件人同購買人資料</label>
          <i class="fa-regular fa-square-check" v-if="isSame"></i>
          <i class="fa-regular fa-square" v-else></i>
        </div>

        <label for="rname">收件人姓名</label>
        <input
          type="text"
          id="rname"
          placeholder="收件人姓名"
          :class="{ inputError: purchaseInfoStore.info.receiver_name.is_error }"
          v-model="purchaseInfoStore.info.receiver_name.value"
          @blur="verify(purchaseInfoStore.info.receiver_name)"
        />
        <div class="errorMessage">
          {{ purchaseInfoStore.info.receiver_name.message }}
        </div>

        <label for="rphone">收件人聯絡電話</label>
        <input
          type="text"
          id="rphone"
          placeholder="收件人聯絡電話"
          :class="{
            inputError: purchaseInfoStore.info.receiver_number.is_error
          }"
          v-model="purchaseInfoStore.info.receiver_number.value"
          @blur="verify(purchaseInfoStore.info.receiver_number)"
        />
        <div class="errorMessage">
          {{ purchaseInfoStore.info.receiver_number.message }}
        </div>

        <label for="feedback">留言給我們</label>
        <textarea
          name=""
          id="feedback"
          cols="30"
          rows="5"
          placeholder="留言給我們"
          v-model="purchaseInfoStore.info_message"
          @input="input_info_message"
        ></textarea>
        <div class="info_messageLength">
          {{ purchaseInfoStore.info_message.length }}/150
        </div>
      </div>

      <div class="right">
        <!-- 運送方式 -->
        <label> 運送方式 </label>
        <template v-if="transport_number < 6">
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.transport === '1' }"
            @click="purchaseInfoStore.transport = '1'"
            v-if="
              commonStore.store.Shipping === '1' || commonStore.Shipping === '2'
            "
          >
            一般宅配
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.transport === '2' }"
            @click="purchaseInfoStore.transport = '2'"
            v-if="
              commonStore.store.Shipping === '1' ||
              commonStore.store.Shipping === '3'
            "
          >
            到店自取
          </div>

          <!-- 7-11 -->
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'UNIMARTDelivery' ||
                purchaseInfoStore.transport === 'UNIMARTC2CDelivery'
            }"
            @click="
              purchaseInfoStore.transport = commonStore.store.UNIMARTDelivery
                ? 'UNIMARTDelivery'
                : 'UNIMARTC2CDelivery'
            "
            v-if="
              commonStore.store.UNIMARTDelivery ||
              commonStore.store.UNIMARTC2CDelivery
            "
          >
            7-11 取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'UNIMART' ||
                purchaseInfoStore.transport === 'UNIMARTC2C'
            }"
            @click="
              purchaseInfoStore.transport = commonStore.store.UNIMART
                ? 'UNIMART'
                : 'UNIMARTC2C'
            "
            v-if="commonStore.store.UNIMART || commonStore.store.UNIMARTC2C"
          >
            7-11 取貨不付款
          </div>
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.transport === 'UNIMARTFREEZEDelivery'
            }"
            @click="purchaseInfoStore.transport = 'UNIMARTFREEZEDelivery'"
            v-if="commonStore.store.UNIMARTFREEZEDelivery"
          >
            7-11冷凍 取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.transport === 'UNIMARTFREEZE' }"
            @click="purchaseInfoStore.transport = 'UNIMARTFREEZE'"
            v-if="commonStore.store.UNIMARTFREEZE"
          >
            7-11冷凍 取貨不付款
          </div>

          <!-- 全家 -->
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'FAMIDelivery' ||
                purchaseInfoStore.transport === 'FAMIC2CDelivery'
            }"
            @click="
              purchaseInfoStore.transport = commonStore.store.FAMIDelivery
                ? 'FAMIDelivery'
                : 'FAMIC2CDelivery'
            "
            v-if="
              commonStore.store.FAMIDelivery ||
              commonStore.store.FAMIC2CDelivery
            "
          >
            全家 取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'FAMI' ||
                purchaseInfoStore.transport === 'FAMIC2C'
            }"
            @click="
              purchaseInfoStore.transport = store.FAMI ? 'FAMI' : 'FAMIC2C'
            "
            v-if="commonStore.store.FAMI || commonStore.store.FAMIC2C"
          >
            全家 取貨不付款
          </div>

          <!-- 萊爾富 -->
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'HILIFEDelivery' ||
                purchaseInfoStore.transport === 'HILIFEC2CDelivery'
            }"
            @click="
              purchaseInfoStore.transport = store.HILIFEDelivery
                ? 'HILIFEDelivery'
                : 'HILIFEC2CDelivery'
            "
            v-if="
              commonStore.store.HILIFEDelivery ||
              commonStore.store.HILIFEC2CDelivery
            "
          >
            萊爾富 取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{
              active:
                purchaseInfoStore.transport === 'HILIFE' ||
                purchaseInfoStore.transport === 'HILIFEC2C'
            }"
            @click="
              purchaseInfoStore.transport = commonStore.store.HILIFE
                ? 'HILIFE'
                : 'HILIFEC2C'
            "
            v-if="commonStore.store.HILIFE || commonStore.store.HILIFEC2C"
          >
            萊爾富 取貨不付款
          </div>

          <!-- OK超商 -->
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.transport === 'OKMARTC2CDelivery'
            }"
            @click="purchaseInfoStore.transport = 'OKMARTC2CDelivery'"
            v-if="commonStore.store.OKMARTC2CCDelivery"
          >
            OK超商 取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.transport === 'OKMARTC2C' }"
            @click="purchaseInfoStore.transport = 'OKMARTC2C'"
            v-if="commonStore.store.OKMARTC2C"
          >
            OK超商 取貨不付款
          </div>
        </template>
        <template v-else>
          <div
            tabindex="0"
            class="select"
            @click="
              purchaseInfoStore.is_show_transport_options =
                !purchaseInfoStore.is_show_transport_options
            "
            @blur="purchaseInfoStore.is_show_transport_options = false"
          >
            <div class="text">
              {{
                purchaseInfoStore.transport !== "0"
                  ? purchaseInfoStore.transport_obj[purchaseInfoStore.transport]
                  : "請選擇運送方式"
              }}
            </div>
            <div
              class="icon"
              :class="{
                iconActive: purchaseInfoStore.is_show_transport_options
              }"
            >
              <i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            <ul
              class="option"
              :class="{
                showOption: purchaseInfoStore.is_show_transport_options
              }"
            >
              <li
                @click.stop="changeTransport('1', false)"
                v-if="
                  commonStore.store.Shipping === '1' ||
                  commonStore.store.Shipping === '2'
                "
              >
                一般宅配
              </li>
              <li
                @click.stop="changeTransport('2', false)"
                v-if="
                  commonStore.store.Shipping === '1' ||
                  commonStore.store.Shipping === '3'
                "
              >
                到店自取
              </li>

              <!-- 7-11 -->
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.UNIMARTDelivery
                      ? 'UNIMARTDelivery'
                      : 'UNIMARTC2CDelivery',
                    false
                  )
                "
                v-if="
                  commonStore.store.UNIMARTDelivery ||
                  commonStore.store.UNIMARTC2CDelivery
                "
              >
                7-11 取貨付款
              </li>
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.UNIMART ? 'UNIMART' : 'UNIMARTC2C',
                    false
                  )
                "
                v-if="commonStore.store.UNIMART || commonStore.store.UNIMARTC2C"
              >
                7-11 取貨不付款
              </li>
              <li
                @click.stop="changeTransport('UNIMARTFREEZEDelivery', false)"
                v-if="commonStore.store.UNIMARTFREEZEDelivery"
              >
                7-11冷凍 取貨付款
              </li>
              <li
                @click.stop="changeTransport('UNIMARTFREEZE', false)"
                v-if="commonStore.store.UNIMARTFREEZE"
              >
                7-11冷凍 取貨不付款
              </li>

              <!-- 全家 -->
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.FAMIDelivery
                      ? 'FAMIDelivery'
                      : 'FAMIC2CDelivery',
                    false
                  )
                "
                v-if="
                  commonStore.store.FAMIDelivery ||
                  commonStore.store.FAMIC2CDelivery
                "
              >
                全家 取貨付款
              </li>
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.FAMI ? 'FAMI' : 'FAMIC2C',
                    false
                  )
                "
                v-if="commonStore.store.FAMI || commonStore.store.FAMIC2C"
              >
                全家 取貨不付款
              </li>

              <!-- 萊爾富 -->
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.HILIFEDelivery
                      ? 'HILIFEDelivery'
                      : 'HILIFEC2CDelivery',
                    false
                  )
                "
                v-if="
                  commonStore.store.HILIFEDelivery ||
                  commonStore.store.HILIFEC2CDelivery
                "
              >
                萊爾富 取貨付款
              </li>
              <li
                @click.stop="
                  changeTransport(
                    commonStore.store.HILIFE ? 'HILIFE' : 'HILIFEC2C',
                    false
                  )
                "
                v-if="commonStore.store.HILIFE || commonStore.store.HILIFEC2C"
              >
                萊爾富 取貨不付款
              </li>

              <!-- OK超商 -->
              <li
                @click.stop="changeTransport('OKMARTC2CDelivery', false)"
                v-if="commonStore.store.OKMARTC2CCDelivery"
              >
                OK超商 取貨付款
              </li>
              <li
                @click.stop="changeTransport('OKMARTC2C', false)"
                v-if="commonStore.store.OKMARTC2C"
              >
                OK超商 取貨不付款
              </li>
            </ul>
          </div>
        </template>
        <div
          class="errorMessage"
          v-if="
            orderStore.is_click_finish_order &&
            purchaseInfoStore.transport === '0'
          "
        >
          請選擇配送方式
        </div>

        <!-- 支付方式 -->
        <label for="pay_method">支付方式</label>
        <div class="custom_select" v-if="commonStore.store.paymethodSort">
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.pay_method === 'CreditCard' }"
            :style="`order: ${commonStore.store.paymethodSort['CreditCard']}`"
            @click="purchaseInfoStore.pay_method = 'CreditCard'"
            v-if="commonStore.store.CreditCard != 0 && !is_collection"
          >
            信用卡
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.pay_method === 'ATM' }"
            :style="`order: ${commonStore.store.paymethodSort['ATM']}`"
            @click="purchaseInfoStore.pay_method = 'ATM'"
            v-if="commonStore.store.ATM != 0 && !is_collection"
          >
            ATM/網路ATM
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.pay_method === 'PayCode' }"
            :style="`order: ${commonStore.store.paymethodSort['PayCode']}`"
            @click="purchaseInfoStore.pay_method = 'PayCode'"
            v-if="commonStore.store.PayCode != 0 && !is_collection"
          >
            超商代碼
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.pay_method === 'PayBarCode' }"
            :style="`order: ${commonStore.store.paymethodSort['PayBarCode']}`"
            @click="purchaseInfoStore.pay_method = 'PayBarCode'"
            v-if="commonStore.store.PayBarCode != 0 && !is_collection"
          >
            超商條碼
          </div>
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.pay_method === 'PayOnDelivery'
            }"
            :style="`order: ${commonStore.store.paymethodSort['PayOnDelivery']}`"
            @click="purchaseInfoStore.pay_method = 'PayOnDelivery'"
            v-if="
              commonStore.store.PayOnDelivery != 0 &&
              !purchaseInfoStore.is_store
            "
          >
            取貨付款
          </div>
          <div
            class="custom_option2"
            :class="{ active: purchaseInfoStore.pay_method === 'LinePay' }"
            :style="`order: ${commonStore.store.paymethodSort['LinePay']}`"
            @click="purchaseInfoStore.pay_method = 'LinePay'"
            v-if="commonStore.store.LinePay == 1 && !is_collection"
          >
            LINE Pay
          </div>

          <!-- 超商取貨付款 -->
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.pay_method === 'MartPayOnDelivery'
            }"
            :style="`order: ${commonStore.store.paymethodSort['PayOnDelivery']}`"
            @click="purchaseInfoStore.pay_method = 'MartPayOnDelivery'"
            v-if="is_collection"
          >
            超商取貨付款
          </div>
        </div>
        <div
          class="errorMessage"
          v-if="
            orderStore.is_click_finish_order &&
            purchaseInfoStore.pay_method === '0'
          "
        >
          請選擇支付方式
        </div>

        <!-- 一般宅配 地址 -->
        <template v-if="purchaseInfoStore.transport == 1">
          <label>
            收件地址
            <template
              v-if="
                memberInfoStore.memberInfo.address_obj &&
                Object.keys(memberInfoStore.memberInfo.address_obj).length <
                  3 &&
                !purchaseInfoStore.has_address
              "
            >
              <input
                style="margin-left: 10px"
                type="checkbox"
                id="is_save_address"
                v-model="purchaseInfoStore.is_save_address"
              />
              <label for="is_save_address"> 加入常用地址 </label>
            </template>
          </label>

          <div
            class="select"
            :class="{
              selectError:
                orderStore.is_click_finish_order &&
                !purchaseInfoStore.info.address.city_active
            }"
            @click="
              purchaseInfoStore.info.address.is_show_city =
                !purchaseInfoStore.info.address.is_show_city
            "
            tabindex="0"
            @blur="purchaseInfoStore.info.address.is_show_city = false"
          >
            <div class="text">
              {{
                !purchaseInfoStore.info.address.city_active
                  ? "城市 / 縣"
                  : purchaseInfoStore.info.address.city_active
              }}
            </div>
            <div
              class="icon"
              :class="{
                iconActive: purchaseInfoStore.info.address.is_show_city
              }"
            >
              <i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            <ul
              class="option"
              :class="{
                showOption: purchaseInfoStore.info.address.is_show_city
              }"
            >
              <li
                v-for="(value, city) in purchaseInfoStore.city_district"
                :key="city"
                @click.stop="changeCity(city, false)"
              >
                {{ city }}
              </li>
            </ul>
          </div>
          <div
            class="select"
            :class="{
              selectError:
                orderStore.is_click_finish_order &&
                !purchaseInfoStore.info.address.district_active
            }"
            @click="
              purchaseInfoStore.city_district[
                purchaseInfoStore.info.address.city_active
              ]
                ? (purchaseInfoStore.info.address.is_show_district =
                    !purchaseInfoStore.info.address.is_show_district)
                : ''
            "
            tabindex="0"
            @blur="purchaseInfoStore.info.address.is_show_district = false"
          >
            <div class="text">
              {{
                !purchaseInfoStore.info.address.district_active
                  ? "地區"
                  : purchaseInfoStore.info.address.district_active
              }}
            </div>
            <div
              class="icon"
              :class="{
                iconActive: purchaseInfoStore.info.address.is_show_district
              }"
            >
              <i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            <ul
              class="option"
              :class="{
                showOption: purchaseInfoStore.info.address.is_show_district
              }"
            >
              <li
                v-for="(zipCode, district) in purchaseInfoStore.city_district[
                  purchaseInfoStore.info.address.city_active
                ]"
                :key="district"
                @click.stop="changeDistrict(district, false)"
              >
                {{ district }} {{ zipCode }}
              </li>
            </ul>
          </div>
          <div class="input_container flex">
            <input
              style="width: 100%"
              type="text"
              placeholder="請輸入詳細地址"
              v-model.trim="purchaseInfoStore.info.address.detail_address"
              :class="{
                inputError:
                  orderStore.is_click_finish_order &&
                  purchaseInfoStore.info.address.detail_address == ''
              }"
            />
          </div>
          <div
            class="errorMessage"
            v-if="purchaseInfoStore.info.address.is_error"
          >
            {{ purchaseInfoStore.info.address.message }}
          </div>

          <div
            class="addressOption"
            v-if="
              memberInfoStore.memberInfo.address_obj &&
              Object.keys(memberInfoStore.memberInfo.address_obj).length
            "
          >
            <label> 常用地址 : </label>
            <div class="custom_select">
              <div
                class="custom_option"
                v-for="(item, key) in memberInfoStore.memberInfo.address_obj"
                :key="key"
                @click="
                  changeAddress(
                    item.address.split(' ')[0],
                    item.address.split(' ')[1],
                    item.address.split(' ')[2]
                  )
                "
              >
                {{ item.address }}
                <i
                  class="fa-regular fa-square-check"
                  v-if="item.address == purchaseInfoStore.receiver_address"
                ></i>
                <i class="fa-regular fa-square" v-else></i>
              </div>
            </div>
          </div>
        </template>

        <!-- 超商取貨 選擇門市 -->
        <template v-if="purchaseInfoStore.is_store">
          <label v-if="!purchaseInfoStore.storeid"> 請選擇門市 </label>
          <div class="storeInfo" v-else>
            <div v-if="purchaseInfoStore.storeid">
              門市店號: {{ purchaseInfoStore.storeid }}
            </div>
            <div v-if="purchaseInfoStore.storename">
              門市名稱: {{ purchaseInfoStore.storename }}
            </div>
            <div v-if="purchaseInfoStore.storeaddress">
              門市地址: {{ purchaseInfoStore.storeaddress }}
            </div>
          </div>

          <div
            class="button2"
            v-if="
              !purchaseInfoStore.storeid ||
              !purchaseInfoStore.storename ||
              !purchaseInfoStore.storeaddress
            "
            @click="purchaseInfoStore.pickConvenienceStore"
          >
            搜尋門市
          </div>
          <div
            class="button2"
            v-else
            @click="purchaseInfoStore.pickConvenienceStore"
          >
            更改門市
          </div>

          <div
            class="errorMessage"
            v-if="
              orderStore.is_click_finish_order &&
              (!purchaseInfoStore.storeid ||
                !purchaseInfoStore.storename ||
                !purchaseInfoStore.storeaddress)
            "
          >
            請選擇門市
          </div>
        </template>

        <!-- 發票 -->
        <template v-if="commonStore.store.Receipt === '1'">
          <label>發票類型</label>
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.personal_or_company === '個人發票'
            }"
            @click="
              ;(purchaseInfoStore.personal_or_company = '個人發票'),
                (purchaseInfoStore.invoice_type = is_other_invoice_type
                  ? '0'
                  : '1')
            "
          >
            個人發票
          </div>
          <div
            class="custom_option2"
            :class="{
              active: purchaseInfoStore.personal_or_company === '公司發票'
            }"
            @click="
              ;(purchaseInfoStore.personal_or_company = '公司發票'),
                (purchaseInfoStore.invoice_type = '2')
            "
          >
            公司發票
          </div>

          <template
            v-if="
              purchaseInfoStore.personal_or_company === '個人發票' &&
              is_other_invoice_type
            "
          >
            <label>個人發票類型</label>

            <div
              class="custom_option2"
              :class="{ active: purchaseInfoStore.invoice_type === '1' }"
              @click="purchaseInfoStore.invoice_type = '1'"
            >
              個人紙本發票
            </div>

            <div
              class="custom_option2"
              v-if="commonStore.store.PhoneCode === '1'"
              :class="{ active: purchaseInfoStore.invoice_type === '3' }"
              @click="purchaseInfoStore.invoice_type = '3'"
            >
              手機條碼載具
            </div>
            <div v-if="purchaseInfoStore.invoice_type === '3'">
              <input
                type="text"
                placeholder="手機條碼載具"
                v-model="purchaseInfoStore.phone_barCode"
              />
              <div
                class="prompt"
                v-if="
                  orderStore.is_click_finish_order &&
                  purchaseInfoStore.phone_barCode === ''
                "
              >
                請填寫手機條碼載具
              </div>
            </div>

            <div
              class="custom_option2"
              v-if="commonStore.store.NatureCode === '1'"
              :class="{ active: purchaseInfoStore.invoice_type === '4' }"
              @click="purchaseInfoStore.invoice_type = '4'"
            >
              自然人憑證載具
            </div>
            <div v-if="purchaseInfoStore.invoice_type === '4'">
              <input
                type="text"
                placeholder="自然人憑證載具"
                v-model="purchaseInfoStore.natural_barCode"
              />
              <div
                class="prompt"
                v-if="
                  orderStore.is_click_finish_order &&
                  purchaseInfoStore.natural_barCode === ''
                "
              >
                請填寫自然人憑證載具
              </div>
            </div>
          </template>

          <template v-if="purchaseInfoStore.invoice_type === '2'">
            <div>
              <input
                type="text"
                id="invoice_title"
                name="公司抬頭"
                placeholder="公司抬頭"
                v-model="purchaseInfoStore.invoice_title"
              />
              <div
                class="errorMessage"
                v-if="
                  orderStore.is_click_finish_order &&
                  purchaseInfoStore.invoice_title === ''
                "
              >
                請填寫公司抬頭
              </div>
            </div>
            <div>
              <input
                type="text"
                id="invoice_uniNumber"
                name="統一編號"
                placeholder="統一編號"
                v-model="purchaseInfoStore.invoice_uniNumber"
              />
              <div
                class="errorMessage"
                v-if="
                  orderStore.is_click_finish_order &&
                  purchaseInfoStore.invoice_uniNumber === ''
                "
              >
                請填寫統一編號
              </div>
            </div>
          </template>

          <div
            class="prompt"
            v-if="
              orderStore.is_click_finish_order &&
              purchaseInfoStore.invoice_type === '0'
            "
          >
            請選擇發票類型
          </div>
        </template>
      </div>
    </form>

    <!-- 有點數 或 有設定回饋% -->
    <template
      v-if="
        cartStore.bonus_array.length ||
        memberInfoStore.memberInfo.total_bonus * 1
      "
    >
      <div class="title">
        購物金
        <span v-if="cartStore.bonus_array.length">
          (<span v-if="!commonStore.user_account"> 會員 </span>
          <span> 訂單完成後 </span>
          <template v-for="item in cartStore.bonus_array">
            <template v-if="item.shipping">
              <template v-if="item.lower == 0">
                ，消費即送 {{ item.shipping }}% 購物金
              </template>
              <template v-else>
                ，滿 NT${{ useNumberThousands(item.lower) }} 送
                {{ item.shipping }}% 購物金
              </template>
            </template> </template
          >)
        </span>
      </div>

      <div class="bonus" v-if="commonStore.user_account">
        <div class="leftBonus">
          購物金餘額 :
          {{
            useNumberThousands(
              memberInfoStore.memberInfo.total_bonus < 0
                ? 0
                : memberInfoStore.memberInfo.total_bonus
            )
          }}
          點
        </div>

        <div
          class="custom_option"
          @click="
            ;(cartStore.is_use_bonus = !cartStore.is_use_bonus),
              purchaseInfoStore.filter_use_bonus(1)
          "
          v-if="memberInfoStore.memberInfo.total_bonus * 1"
        >
          <i
            class="fa-regular fa-square-check"
            v-if="cartStore.is_use_bonus"
          ></i>
          <i class="fa-regular fa-square" v-else></i>
          使用購物金

          <input
            type="number"
            placeholder="購物金"
            v-model="cartStore.use_bonus"
            @click.stop
            @blur="purchaseInfoStore.filter_use_bonus(1)"
          />
        </div>
      </div>
      <div class="noLogin" v-else>
        請先
        <span class="a" @click="useUrlPush('/user')"> 登入會員 </span>
      </div>
    </template>

    <CartStepTotal />

    <div class="buttonGroup">
      <div class="button" @click="cartStore.step = 1">上一步</div>
      <div class="button" @click="orderStore.checkOrder()">
        <i
          v-show="orderStore.isOrderIng"
          class="fas fa-spinner fa-spin"
          style="margin-right: 5px"
        ></i>
        完成訂單
      </div>
    </div>
  </div>
</template>

<script setup>
import CartStepTotal from "./CartStepTotal.vue"

import city_district_json from "@/json/city_district.json"

import { useNumberThousands } from "@/composables/numberThousands"
import { useVerify } from "@/composables/verify"
import { useUrlPush } from "@/composables/urlPush"

const { verify } = useVerify()

const commonStore = useCommonStore()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const purchaseInfoStore = usePurchaseInfoStore()
const memberInfoStore = useMemberInfoStore()

let props = defineProps(["main", "addProduct", "event"])

const isSame = ref(false)
const city_district = ref(city_district_json)

const transport_number = computed(() => {
  let number = 0
  if (commonStore.store.Shipping === "1") number += 2
  if (commonStore.store.Shipping === "2") number += 1
  if (commonStore.store.Shipping === "3") number += 1

  if (commonStore.store.UNIMARTDelivery || commonStore.store.UNIMARTC2CDelivery)
    number += 1
  if (commonStore.store.UNIMART || commonStore.store.UNIMARTC2C) number += 1
  if (commonStore.store.UNIMARTFREEZEDelivery) number += 1
  if (commonStore.store.UNIMARTFREEZE) number += 1

  if (commonStore.store.HILIFEDelivery || commonStore.store.HILIFEC2CDelivery)
    number += 1
  if (commonStore.store.HILIFE || commonStore.store.HILIFEC2C) number += 1

  if (commonStore.store.OKMARTC2C) number += 1
  if (commonStore.store.OKMARTC2CCDelivery) number += 1

  return number
})

const is_collection = computed(() => {
  if (purchaseInfoStore.transport == 0) return undefined
  else if (purchaseInfoStore.transport.indexOf("Delivery") > -1) return true
  else return false
})

const is_other_invoice_type = computed(() => {
  if (
    commonStore.store.PhoneCode === "1" ||
    commonStore.store.NatureCode === "1"
  )
    return true
  return false
})

watch(isSame, (v) => {
  if (v) {
    purchaseInfoStore.info.receiver_name.value =
      purchaseInfoStore.info.purchaser_name.value
    purchaseInfoStore.info.receiver_number.value =
      purchaseInfoStore.info.purchaser_phone.value
  }
  verify(
    purchaseInfoStore.info.receiver_name,
    purchaseInfoStore.info.receiver_number
  )
})

watch(
  () => purchaseInfoStore.transport,
  (newV, oldV) => {
    if (newV.indexOf("Delivery") > -1)
      purchaseInfoStore.pay_method = "MartPayOnDelivery"
    let newMart = newV
      .replace("C2CC", "")
      .replace("C2C", "")
      .replace("Delivery", "")
    let oldMart = oldV
      .replace("C2CC", "")
      .replace("C2C", "")
      .replace("Delivery", "")
    if (newMart != oldMart) {
      purchaseInfoStore.storeid = ""
      purchaseInfoStore.storename = ""
      purchaseInfoStore.storeaddress = ""
    }

    cartStore.getTotal(1)
  }
)

watch(
  () => purchaseInfoStore.info.address.city_active,
  (newV, oldV) => {
    for (let key in city_district.value[newV]) {
      if (key == purchaseInfoStore.info.address.district_active) return
    }
    purchaseInfoStore.info.address.district_active = ""
  },
  { deep: true }
)

watch(
  () => [
    purchaseInfoStore.info.address.city_active,
    purchaseInfoStore.info.address.district_active,
    purchaseInfoStore.info.address.detail_address
  ],
  () => {
    if (orderStore.is_click_finish_order) verify(purchaseInfoStore.info.address)
  },
  { deep: true }
)

// methods ========== ========== ========== ========== ==========
// 同步 購買人 收件人 資訊
function input_purchaser() {
  if (isSame.value) {
    purchaseInfoStore.info.receiver_name.value =
      purchaseInfoStore.info.purchaser_name.value
    purchaseInfoStore.info.receiver_number.value =
      purchaseInfoStore.info.purchaser_phone.value
    verify(
      purchaseInfoStore.info.receiver_name,
      purchaseInfoStore.info.receiver_number
    )
  }
}
// 留言字數控制在150以下
function input_info_message() {
  if (purchaseInfoStore.info_message.length > 150)
    purchaseInfoStore.info_message = purchaseInfoStore.info_message.substring(
      0,
      150
    )
}

function changeTransport(transport, is_show_transport_options) {
  purchaseInfoStore.transport = transport
  purchaseInfoStore.is_show_transport_options = is_show_transport_options
}

function changeCity(city, is_show_city) {
  purchaseInfoStore.info.address.city_active = city
  purchaseInfoStore.info.address.is_show_city = is_show_city
}

function changeDistrict(district, is_show_district) {
  purchaseInfoStore.info.address.district_active = district
  purchaseInfoStore.info.address.is_show_district = is_show_district
}

function changeAddress(city, district, detail) {
  purchaseInfoStore.info.address.city_active = city
  purchaseInfoStore.info.address.district_active = district
  purchaseInfoStore.info.address.detail_address = detail
}

onMounted(() => {
  if (commonStore.user_account) memberInfoStore.getMemberInfo()
})
</script>
