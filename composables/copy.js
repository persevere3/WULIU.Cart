// 複製輸入框內容 text: 複製內容 selector: 選擇器 ex: '.copy'

export function useCopy(text, selector) {
  if (!text || !selector) return

  let copy_input = document.querySelector(selector)
  copy_input.value = text
  copy_input.select()
  document.execCommand("copy")
}
