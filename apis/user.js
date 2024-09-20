import { formDataRequest } from "@/utils/https"

/*
  
*/
export const getLineProfileApi = (LineToken) =>
  $fetch("https://api.line.me/oauth2/v2.1/userinfo", {
    headers: {
      Authorization: `Bearer ${LineToken}`
    },
    withCredentials: true
  })

/* Line註冊 */
export const validateRecommenderCodeApi = (formData) =>
  formDataRequest.post("/interface/WebMember/CheckRecommanderCode", formData)

/* 寄發驗證碼 */
export const send_verify_codeApi = (formData) =>
  $fetch("/interface/WebMember/SendValidateMessage", {
    method: "POST",
    body: formData
  })

/* 會員 註冊 */
export const registerApi = (formData) =>
  formDataRequest.post("/interface/WebMember/MemberRegister", formData)

/* 會員 登入 */
export const userLoginApi = (formData) =>
  $fetch("/interface/WebMember/MemberLogin", {
    method: "POST",
    body: formData
  })

/* 寄發 忘記密碼 驗證碼 */
export const send_forget_verify_codeApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/ForgetPasswordValidateMessage",
    formData
  )

/* 檢查 忘記密碼 驗證碼 */
export const check_forget_verify_codeApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/CheckForgetPasswordValidate",
    formData
  )

/* 忘記密碼 修改密碼 */
export const edit_forget_passApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/changeforgetpasswordvalidate",
    formData
  )
