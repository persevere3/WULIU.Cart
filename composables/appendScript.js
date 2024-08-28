export function useAppendScript(text, tag) {
  return

  if (!text) return

  //
  let script_arr = []

  let scriptItems = text.split("&lt;script")
  scriptItems.splice(0, 1)

  for (let i = 0; i < scriptItems.length; i++) {
    scriptItems[i] = "&lt;script " + scriptItems[i].trim()
    let attr = scriptItems[i].split("&gt;")[0]

    let content = scriptItems[i].split("&gt;")[1].split("&lt;/script")[0]
    let arr = attr.split(" ")
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf('="') != -1) {
        obj[arr[i].split('="')[0]] = arr[i].split('="')[1].split('"')[0]
      }
    }

    let script = document.createElement("script")
    for (let item in obj) {
      script.setAttribute(item, obj[item])
    }
    script.textContent = content

    script_arr.push(script)
  }

  //
  for (let i = 0; i < script_arr.length; i++) {
    document.querySelector(tag).appendChild(script_arr[i])
  }
}
