/* 會員資訊 */

/* 查
  let obj = {
    storeid: commonStore.site.Name,
    phone: commonStore.user_account
  }
  let formData = return_formData(obj)
*/
export const getMemberInfoApi = (query) =>
  $fetch("/interface/WebMember/GetMemberInfo", {
    method: "POST",
    query
  })

/*
  改
*/
export const updateMemberInfoApi = (query) =>
  $fetch("/interface/WebMember/EditMemberInfo", {
    method: "POST",
    query
  })

/* 改密碼
 */
export const updateMemberPassApi = (query) =>
  $fetch("/interface/WebMember/EditMemberPassWord", {
    method: "POST",
    query
  })

/* 查紅利
 */
export const getBonusApi = (formData) =>
  $fetch("/interface/WebMember/GetMemberBonusOrders", {
    method: "POST",
    query
  })

/* 會員登出
 */
export const logoutApi = () =>
  $fetch("/interface/WebMember/MemberLogout", {
    method: "POST"
  })

/*
 */
export const unbindLine_testApi = (query) =>
  $fetch("/interface/WebMember/OldMemberDeleteLineIDAccount", {
    method: "POST",
    query
  })

/*
 */
export const deleteAccount_testApi = (query) =>
  $fetch("/interface/WebMember/DeleteLineIDAccount", {
    method: "POST",
    query
  })
