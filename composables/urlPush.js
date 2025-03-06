// 路由跳轉 isOpen: 是否另開分頁

export function useUrlPush(url, isOpen) {
  if (!url) return
  if (isOpen) window.open(url)
  else window.location.href = url
}
