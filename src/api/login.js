/*
 * @Descripttion:
 * @version:
 * @Date: 2021-04-20 11:06:21
 * @LastEditors: huzhushan@126.com
 * @LastEditTime: 2021-04-21 09:36:55
 * @Author: huzhushan@126.com
 * @HomePage: https://huzhushan.gitee.io/vue3-element-admin
 * @Github: https://github.com/huzhushan/vue3-element-admin
 * @Donate: https://huzhushan.gitee.io/vue3-element-admin/donate/
 */
import request from '@/utils/request'


const api_name="/admin/system/index";

// 获取验证码
export const LogOut = () => {
  return request({
    url: `${api_name}/logout`,
    method: 'get',
  })
}
//GetValidateCode
// 获取验证码
export const GetValidateCode = () => {
  return request({
    url: `${api_name}/generateValidateCode`,
    method: 'get',
  })
}

// 登录接口
export const Login = data => {
  return request({
    url: '/admin/system/index/login',
    method: 'post',
    data,
  })
}

// 获取登录用户信息
// /admin/system/index/userinfo
export const GetUserinfo = () => {
  return request({
    url: `${api_name}/userinfo`,
    method: 'get',
  })
}
