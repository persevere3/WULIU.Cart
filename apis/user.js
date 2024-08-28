import axios from "axios"
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

/*
  Line註冊
  let obj = {
    storeid: site.value.Name,
    recommender: state.r_recommender.value,
  }
  let formData = return_formData(obj)
*/
export const validateRecommenderCodeApi = (formData) =>
  formDataRequest.post("/interface/WebMember/CheckRecommanderCode", formData)

/*
  寄發驗證碼
  let obj = {
    storeid: site.value.Name,
    storeName: site.value.Store, // store.value.Name
    phone: r_account.value.value.trim(),
    mail: r_mail.value.value.trim(),
    type: store.value.NotificationSystem,
    notificationsystem: store.value.NotificationSystem,
  }
  let formData = return_formData(obj)
*/
export const send_verify_codeApi = (formData) =>
  formDataRequest.post("/interface/WebMember/SendValidateMessage", formData)

/*
  會員 註冊
  let obj = {
    storeid: site.value.Name,
    type: store.value.NotificationSystem,
    recommender: r_recommender.value.value, // ''
    name: r_name.value.value,
    phone: r_account.value.value,
    email: r_mail.value.value,
    gender: sex.value == 'male' ? 1 : 0 ,
    birthday: useFormatDate(r_birthday.value),
    password: r_password.value.value,
  }

  if(obj.type == 0) obj.validate2 = r_mail_verify_code.value.value
  else if(obj.type == 1) obj.validate = r_phone_verify_code.value.value
  else {
    obj.validate = r_phone_verify_code.value.value
    obj.validate2 = r_mail_verify_code.value.value
  }

  let formData = return_formData(obj)
*/
export const registerApi = (formData) =>
  formDataRequest.post("/interface/WebMember/MemberRegister", formData)

/*
  會員 登入
  let obj = {
    storeid: site.value.Name,
    phone: l_account.value.value,
    password: l_password.value.value,
    realAccount: l_account.value.value,
  }
  let formData = return_formData(obj)
*/
export const userLoginApi = (formData) =>
  formDataRequest.post("/interface/WebMember/MemberLogin", formData)

/*
  寄發 忘記密碼 驗證碼
  let obj = {
    storeid: site.value.Name,
    storeName: site.value.Store,
    notificationsystem: store.value.NotificationSystem,
    phoneormail: methods.getPhoneOrMail()
  }
  let formData = return_formData(obj)
*/
export const send_forget_verify_codeApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/ForgetPasswordValidateMessage",
    formData
  )

/*
  檢查 忘記密碼 驗證碼
  let obj = {
    storeid: site.value.Name,
    phoneormail: methods.getPhoneOrMail(),
    validate: f_verify_code.value.value,
  }
  let formData = return_formData(obj)
*/
export const check_forget_verify_codeApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/CheckForgetPasswordValidate",
    formData
  )

/* 
  忘記密碼 修改密碼
  let obj = {
    storeid: site.value.Name,
    phoneormail: methods.getPhoneOrMail(),
    validate: f_verify_code.value.value,
    newpassword: f_password.value.value
  }
  let formData = return_formData(obj)
*/
export const edit_forget_passApi = (formData) =>
  formDataRequest.post(
    "/interface/WebMember/changeforgetpasswordvalidate",
    formData
  )
