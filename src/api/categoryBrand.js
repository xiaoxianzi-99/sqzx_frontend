import request from "@/utils/request";

const api_name = '/admin/product/categoryBrand'

export const listCategoryBrand = (pageNum,pageSize,queryData)=>{
    return request({
        url: `${api_name}/list/${pageNum}/${pageSize}`,
        method: 'get',
        params: queryData
    })
}
export const saveCategoryBrand = (categoryBrand)=>{
    return request({
        url: `${api_name}/save`,
        method: 'post',
        data: categoryBrand
    })
}
export const updateCategoryBrand = (categoryBrand)=>{
    return request({
        url: `${api_name}/update`,
        method: 'put',
        data: categoryBrand
    })
}
export const deleteCategoryBrand = (id)=>{
    return request({
        url: `${api_name}/delete/${id}`,
        method: 'delete'
    })
}
export const FindBrandByCategoryId = (categoryId)=>{
    return request({
        url: `${api_name}/findBrandByCategoryId/${categoryId}`,
        method: 'get'
    })
}