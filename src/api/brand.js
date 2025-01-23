import request from "@/utils/request";

const api_name = '/admin/product/brand'

export const listByPage = (pageNum, pageSize) => {
    return request({
        url: `${api_name}/list/${pageNum}/${pageSize}`,
        method: 'get',
    })
}
export const saveBrand = data => {
    return request({
        url: `${api_name}/save`,
        method: 'post',
        data
    })
}
export const updateBrand = data => {
    return request({
        url: `${api_name}/update`,
        method: 'put',
        data
    })
}
export const removeById = id => {
    return request({
        url: `${api_name}/deleteById/${id}`,
        method: 'delete'
    })
}
export const findAllBrands = () => {
    return request({
        url: `${api_name}/findAll`,
        method: 'get'
    })
}