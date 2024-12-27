<template>
  <div class="orderDetail">
    <div class="title_container">
      <div class="icon">
        <i class="fa fa-check-circle" aria-hidden="true"></i>
      </div>
      <div class="text">已經收到您的訂單</div>
      <div class="number">訂單號碼 ： FA4102294509</div>
    </div>
    <div class="pay_container bg">
      <div class="row">
        <div class="tag">付款方式</div>
        <div class="value">信用卡</div>
      </div>
      <div class="row">
        <div class="tag">付款狀態</div>
        <div class="value">付款完成</div>
      </div>
      <div class="row">
        <div class="tag">付款時間</div>
        <div class="value">2024-10-25 16:29:35</div>
      </div>

      <div class="row">
        <div class="tag">付款金額</div>
        <div class="value">NT$ 699</div>
      </div>
    </div>
    <div class="products_container bg">
      <div class="row thead">
        <div class="img column jcc">圖片</div>
        <div class="items column">品項</div>
        <div class="unitPrice column jcc">單價</div>
        <div class="quantity column jcc">數量</div>
        <div class="price column">金額</div>
      </div>
      <div class="row">
        <div class="img column jcc"></div>
        <div class="items column">
          茶馬司 粽夏夜 粽意你 海陸珍饌奢華八寶粽禮盒
        </div>
        <div class="unitPrice column jcc">NT$ 1600</div>
        <div class="quantity column jcc">8</div>
        <div class="price column">NT$ 12800</div>
      </div>
      <div class="row">
        <div class="img column jcc"></div>
        <div class="items column">
          茶馬司 粽夏夜 粽意你 海陸珍饌奢華八寶粽禮盒
        </div>
        <div class="unitPrice column jcc">NT$ 1600</div>
        <div class="quantity column jcc">8</div>
        <div class="price column">NT$ 12800</div>
      </div>
      <div class="row">
        <div class="img column jcc"></div>
        <div class="items column">
          茶馬司 粽夏夜 粽意你 海陸珍饌奢華八寶粽禮盒
        </div>
        <div class="unitPrice column jcc">NT$ 1600</div>
        <div class="quantity column jcc">8</div>
        <div class="price column">NT$ 12800</div>
      </div>

      <div class="line"></div>

      <div class="row">
        <div class="items_tag">+ 運費</div>
        <div class="items_price">NT$ 90</div>
      </div>
      <div class="row">
        <div class="items_tag">- 折扣</div>
        <div class="items_price">NT$ 617</div>
      </div>
      <div class="row">
        <div class="items_tag">- 優惠碼折扣</div>
        <div class="items_price">NT$ 0</div>
      </div>
      <div class="row">
        <div class="items_tag">- 回饋金折扣</div>
        <div class="items_price">NT$ 0</div>
      </div>

      <div class="line"></div>

      <div class="row">
        <div class="items_tag">= 總計</div>
        <div class="items_price">NT$ 61133</div>
      </div>
    </div>
    <div class="info_container bg">
      <div class="row">
        <div class="tag">收件人</div>
        <div class="value">**翔 先生</div>
      </div>
      <div class="row">
        <div class="tag">聯絡電話</div>
        <div class="value">092***0891</div>
      </div>
      <div class="row">
        <div class="tag">Email</div>
        <div class="value">x*********0@yahoo.com.tw</div>
      </div>
      <div class="row">
        <div class="tag">運送方式</div>
        <div class="value">到店取貨</div>
      </div>
      <div class="row">
        <div class="tag">取貨門市</div>
        <div class="value">
          <div class="store">Teamars茶馬司訪山茶店</div>
          <div class="info">
            <div>電話: 04-22510019</div>
            <div>地址: 408 台中市南屯區惠文路536號</div>
            <div>營業時間: 10:00-22:00</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="tag">備註</div>
        <div class="value"></div>
      </div>
    </div>
    <div class="history_container">
      <ul>
        <li>
          <div class="item">
            <div class="history_title">
              給店家留言在此輸入，店家將會看到您的留言
            </div>
            <textarea name="" id="" rows="5"></textarea>
            <div class="comment_btn">留言</div>
          </div>
        </li>
        <li>
          <div class="item">
            <div class="history_title">更新訂單處理狀態</div>
            <div class="history_content">訂單處理狀態從 等待確認 -> 確認中</div>
          </div>
          <div class="history_time">2024-10-30 17:31:26</div>
        </li>
        <li>
          <div class="item">
            <div class="history_title">更新訂單處理狀態</div>
            <div class="history_content">訂單處理狀態從 等待確認 -> 確認中</div>
          </div>
          <div class="history_time">2024-10-30 17:31:26</div>
        </li>
        <li>
          <div class="item">
            <div class="history_title">更新訂單處理狀態</div>
            <div class="history_content">訂單處理狀態從 等待確認 -> 確認中</div>
          </div>
          <div class="history_time">2024-10-30 17:31:26</div>
        </li>
        <li>
          <div class="item">
            <div class="history_title">更新訂單處理狀態</div>
            <div class="history_content">訂單處理狀態從 等待確認 -> 確認中</div>
          </div>
          <div class="history_time">2024-10-30 17:31:26</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
      integrity:
        "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==",
      crossorigin: "anonymous"
    }
  ]
})

definePageMeta({
  layout: false
})
</script>

<style lang="scss">
.orderDetail {
  padding: 20px;

  .title_container {
    color: #5a5a5a;
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon {
      width: 100px;
      aspect-ratio: 1 / 1;
      margin-bottom: 5px;
      font-size: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .text {
      margin-bottom: 5px;
      font-size: 24px;
    }
    .number {
      font-size: 20px;
    }
  }

  .bg {
    width: 90%;
    max-width: 900px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 20px;
    border-radius: 10px;
    background-color: #efefef;
  }
  .row {
    display: flex;
    align-items: center;

    &.thead {
      border-radius: 5px;
      background-color: $primaryColor;
      color: #fff;
    }
  }
  .column {
    padding: 5px 10px;
  }
  .tag {
    width: 100px;
    height: 30px;
    margin: 5px 10px;
    border-radius: 15px;
    background-color: $primaryColor;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .jcc {
    display: flex;
    justify-content: center;
  }
  .aic {
    display: flex;
    align-items: center;
  }

  .products_container {
    .row {
      align-items: stretch;
    }
    .column {
      border-right: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: center;

      &:last-child {
        border-right: 0px solid #ccc;
      }
    }

    .line {
      margin: 10px 0;
      height: 1px;
      background: #ccc;
    }

    .items_tag {
      width: 15%;
      margin-left: auto;
      padding: 5px 10px;
    }
    .items_price {
      width: 15%;
      padding: 5px 10px;
      text-align: right;
    }

    .img {
      width: 15%;
    }

    .items {
      width: 40%;
    }

    .unitPrice {
      width: 15%;
    }

    .quantity {
      width: 15%;
    }

    .price {
      width: 15%;
    }
  }

  .history_container {
    ul {
      width: 90%;
      max-width: 900px;
      margin: 20px auto;
      padding: 10px 0 30px 0;
      position: relative;

      &:before {
        content: "";
        width: 1px;
        position: absolute;
        left: 5%;
        top: 0;
        bottom: 0;
        transform: translateX(-50%);
        background: linear-gradient(
          $primaryColor,
          $primaryColor,
          $primaryColor,
          #fff
        );
      }

      li {
        margin-top: 20px;

        position: relative;

        &:before {
          content: "";
          width: 10px;
          aspect-ratio: 1 / 1;
          position: absolute;
          left: 5%;
          top: 25%;
          transform: translateX(-50%);
          border-radius: 100px;
          background-color: $primaryColor;
          z-index: 1;
        }

        .item {
          width: 90%;
          margin-left: auto;
          padding: 20px;
          border-radius: 10px;
          background-color: #efefef;
          display: flex;
          flex-direction: column;
          align-items: start;

          .history_title {
            margin-bottom: 10px;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: $primaryColor;
            color: #fff;
          }

          textarea {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            outline: none;
            border: 1px solid #5a5a5a;
          }
          .comment_btn {
            @include button(
              auto,
              35px,
              0 20px,
              0,
              3px,
              $primaryColor,
              #fff,
              $font_s
            );
          }
        }

        .history_time {
          width: 88%;
          margin-left: auto;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
