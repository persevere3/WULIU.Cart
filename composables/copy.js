export function useCopy(text, selector) {
  if (!text || !selector) return

  let copy_input = document.querySelector(selector)
  copy_input.value = text
  copy_input.select()
  document.execCommand("copy")
}
