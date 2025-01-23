import request from "@/utils/request";
const api_name = '/admin/product/productSpec'

export const listProductSpec = (pageNum,pageSize)=>{
    return request({
        url: `${api_name}/listByPage/${pageNum}/${pageSize}`,
        method: 'get',
    })
}
export const saveProductSpec = (productSpec)=>{
    return request({
        url: `${api_name}/save`,
        method: 'post',
        data: productSpec
    })
}
export const updateProductSpec = (productSpec)=>{
    return request({
        url: `${api_name}/updateById`,
        method: 'put',
        data: productSpec
    })
}
export const deleteProductSpec = (id)=>{
    return request({
        url: `${api_name}/deleteById/${id}`,
        method: 'delete'
    })
}
export const FindAllProductSpec = ()=>{
    return request({
        url: `${api_name}/findAll`,
        method: 'get'
    })
}