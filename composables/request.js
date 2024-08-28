export function useRequest() {
  // data => formUrlencoded or 只post WebPreview Preview
  function return_formUrlencoded(origin) {
    let formUrlencoded = ""

    for (let key in origin) {
      let value = origin[key]
      formUrlencoded += `${formUrlencoded ? "&" : ""}${key}=${value}`
    }

    return formUrlencoded
  }
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
