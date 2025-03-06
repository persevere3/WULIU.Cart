// 驗證 資料

export function useVerify() {
  const verify_methods = {
    required_verify(item) {
      if (item.hasOwnProperty("value")) {
        if (!item.value) {
          item.is_error = true
          item.message = item.rules.required.message
          return false
        } else {
          item.is_error = false
          item.message = ""
          return true
        }
      } else if (item.hasOwnProperty("city_active")) {
        if (
          !item.city_active ||
          !item.district_active ||
          !item.detail_address
        ) {
          item.is_error = true
          item.message = item.rules.required.message
          return false
        } else {
          item.is_error = false
          item.message = ""
          return true
        }
      }
    },

    name_verify(item) {
      let regExp = /^[\u4e00-\u9fa5]+$|^[a-zA-Z]+$/
      if (!regExp.test(item.value)) {
        item.is_error = true
        item.message = item.rules.name.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    },

    nameLength_verify(item) {
      let chineseRegExp = /^[\u4e00-\u9fa5]+$/
      let englishRegExp = /^[a-zA-Z]+$/
      let is_error = false
      if (chineseRegExp.test(item.value)) {
        if (item.value.length > 5 || item.value.length < 2) {
          is_error = true
        }
      } else if (englishRegExp.test(item.value)) {
        if (item.value.length > 10 || item.value.length < 4) {
          is_error = true
        }
      }

      if (is_error) {
        item.is_error = true
        item.message = item.rules.nameLength.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    },

    cellphone_verify(item) {
      let rep = /^(09)[0-9]{8}$/
      if (item.value && !rep.test(item.value)) {
        item.is_error = true
        item.message = item.rules.cellphone.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    },

    length_verify(item) {
      if (
        item.value.length < item.rules.length.min ||
        item.value.length > item.rules.length.max
      ) {
        item.is_error = true
        item.message = item.rules.length.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    },

    mail_verify(item) {
      let rep = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
      if (!rep.test(item.value)) {
        item.is_error = true
        item.message = item.rules.mail.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    },

    confirm_verify(item) {
      if (item.value != item.rules.confirm.password.value) {
        item.is_error = true
        item.message = item.rules.confirm.message
        return false
      } else {
        item.is_error = false
        item.message = ""
        return true
      }
    }
  }

  const methods = {
    // item: 資料物件
    reset(item) {
      item.value = ""
      item.is_error = false
      item.message = ""
    },
    // arr: 資料物件陣列
    verify(...arr) {
      let is_valid = true
      // item 資料物件
      for (let item of arr) {
        // 根據資料物件的rules，呼叫相對應的驗證function
        for (let rule in item.rules) {
          if (!verify_methods[`${rule}_verify`](item)) {
            is_valid = false
            break
          }
        }
      }
      return is_valid
    }
  }

  return {
    ...methods
  }
}
