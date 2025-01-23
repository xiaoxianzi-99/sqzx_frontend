import request from "@/utils/request";

const api_name = '/admin/product/category'
export const findCategoryByParentId = parentId => {
    return request({
        url: `${api_name}/findCategoryByParentId/${parentId}`,
        method: 'get',
    })
}
export const exportData = () => {
    return request({
        url: `${api_name}/exportData`,
        method: 'get',
        responseType: 'blob' // 表明返回的数据是二进制数据
    })
}
