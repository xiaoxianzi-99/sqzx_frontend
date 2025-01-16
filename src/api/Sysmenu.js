import request from '@/utils/request'

const api_name = '/admin/system/sysMenu'

export const findNodes = () => {
  return request({
    url: `${api_name}/findNodes`,
    method: 'get',
  })
}
export const saveSysMenu = (sysMenu) => {
    return request({
        url: `${api_name}/save`,
        method: 'post',
        data: sysMenu
    })
}
export const updateSysMenu = (sysMenu) => {
    return request({
        url: `${api_name}/updateById`,
        method: 'put',
        data: sysMenu
    })
}
export const deleteSysMenuById = (id) => {
    return request({
        url: `${api_name}/deleteById/${id}`,
        method: 'delete'
    })
}