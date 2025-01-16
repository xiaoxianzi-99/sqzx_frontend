import requser from '@/utils/request'
import request from "@/utils/request";

const api_name = 'admin/system/sysRole'

//获取角色列表
export const getSysRoleList = (userId) => {
    return request({
        url: `${api_name}/findAllRoles/${userId}`,
        method: 'get'
    })
}

export const deleteSysRoleById = (id) => {
    return request({
        url: `${api_name}/deleteSysRole/${id}`,
        method: 'delete'
    })
}

export const updateSysRole = (sysRole) => {
    return request({
        url: `${api_name}/updateSysRole`,
        method: 'put',
        data: sysRole
    })
}

export const SaveSysRole = (sysRole) => {
    return request({
        url: `${api_name}/saveSysRole`,
        method: 'post',
        data: sysRole
    })
}
//findByPage
//获取角色分页列表
export const getSysRoleListByPage = (pageNum, pageSize, queryDto) => {
    return request({
        url: `${api_name}/findByPage/${pageNum}/${pageSize}`,
        method: 'get',
        params: queryDto
    })
}

export const findSysRoleMenuByRoleId = (roleId) => {
    return request({
        url: `/admin/system/sysRoleMenu/findSysRoleMenuByRoleId/${roleId}`,
        method: 'get'
    })
}

export const doAssign = (data) => {
    return request({
        url: `/admin/system/sysRoleMenu/doAssign`,
        method: 'post',
        data
    })
}