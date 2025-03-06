// api 參數 物件轉成query或formData

export function useRequest() {
  // 物件轉成query
  // data => formUrlencoded or 只post WebPreview Preview
  function return_formUrlencoded(origin) {
    let formUrlencoded = ""

    for (let key in origin) {
      let value = origin[key]
      formUrlencoded += `${formUrlencoded ? "&" : ""}${key}=${value}`
    }

    return formUrlencoded
  }
  // 物件轉成formData
  // data => formData or 只post WebPreview
  function return_formData(origin) {
    let formData = new FormData()

    for (let key in origin) {
      formData.append(key, origin[key])
    }

    return formData
  }

  return {
    return_formUrlencoded,
    return_formData
  }
}
