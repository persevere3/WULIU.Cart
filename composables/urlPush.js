export function useUrlPush(url, isOpen) {
  if (!url) return
  if (isOpen) window.open(url)
  else window.location.href = url
}
