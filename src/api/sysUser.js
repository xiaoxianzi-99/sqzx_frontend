import request from "@/utils/request";

const api_name = 'admin/system/sysUser'

//获取分页
export const getSysUserListByPage = (pageNum, pageSize, queryDto) => {
    return request({
        url: `${api_name}/findByPage/${pageNum}/${pageSize}`,
        method: 'get',
        params: queryDto
    })
}
export const saveSysUser = (sysUser) => {
    return request({
        url: `${api_name}/saveSysUser`,
        method: 'post',
        data: sysUser
    })
}
export const updateSysUser = (sysUser) => {
    return request({
        url: `${api_name}/updateSysUser`,
        method: 'put',
        data: sysUser
    })
}
export const deleteSysUserById = (id) => {
    return request({
        url: `${api_name}/deleteSysUser/${id}`,
        method: 'delete'
    })
}
//保存用户分配角色
export const saveUserRoles = (data) => {
    return request({
        url: `admin/system/sysUserRole/addUserRoles`,
        method: 'post',
        data: data
    })
}
