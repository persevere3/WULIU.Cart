export function useFormatDate(date, comma = "-", isTime) {
  let d = `${date.getFullYear()}${comma}${date.getMonth() + 1 < 10 ? "0" : ""}${
    date.getMonth() + 1
  }${comma}${date.getDate() < 10 ? "0" : ""}${date.getDate()}`

  let t = `${date.getHours() < 10 ? "0" : ""}${date.getHours()}:${
    date.getMinutes() < 10 ? "0" : ""
  }${date.getMinutes()}:${
    date.getSeconds() < 10 ? "0" : ""
  }${date.getSeconds()}`

  let res = isTime ? `${d} ${t}` : d
  return res
}
